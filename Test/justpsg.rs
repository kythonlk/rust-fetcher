use postgres::{Client, NoTls, Error};

use reqwest;
struct Users {
    _id: i64,
    name: String,
    email: String,
}

fn main() -> Result<(), Error> {
    let connection_url ="url";
    let mut client = Client::connect(connection_url, NoTls)?;

    for row in client.query("SELECT id, name, email FROM users", &[])? {
        let users = Users {
            _id: row.get(0),
            name: row.get(1),
            email: row.get(2),
        };
        println!("users {} is from {}", users.name, users.email);
    }

    Ok(())
}


#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let api_url = "http://localhost:3030/api/users/all";
    let response = reqwest::get(api_url).await?;

    if response.status().is_success() {
        let body = response.text().await?;
        println!("API Data: {}", body);
    } else {
        eprintln!("Failed to fetch data from the API");
    }

    Ok(())
}
