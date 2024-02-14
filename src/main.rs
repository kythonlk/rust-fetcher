use reqwest;
use serde::{Deserialize, Serialize};
use std::error::Error;
use tokio;
use tokio_postgres::{NoTls, Client};

#[derive(Serialize, Deserialize)]
struct User {
    id: i64,
    name: String,
    email: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let (client, connection) =
        tokio_postgres::connect("url", NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });


    sync_data_from_crm("http://localhost:3030/api/users/all", &client).await?;


    
    Ok(())
}

async fn sync_data_from_crm(api_endpoint: &str, client: &Client) -> Result<(), Box<dyn Error>> {
    let res = reqwest::get(api_endpoint).await?;
    let fetched_users: Vec<User> = res.json().await?;

    for user in fetched_users.iter() {
        client.execute(
            "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email",
            &[&user.id, &user.name, &user.email],
        ).await?; 
    }

    println!("Sync complete");
    Ok(())
}