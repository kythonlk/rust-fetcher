use postgres::{Client, NoTls, Error};
use reqwest;

struct Users {
    _id: i64,
    name: String,
    email: String,
}

async fn fetch_data_from_postgres() -> Result<(), Error> {
    let connection_url = "url";
    let mut client = Client::connect(connection_url, NoTls)?;

    for row in client.query("SELECT id, name, email FROM users", &[])? {
        let users = Users {
            _id: row.get(0),
            name: row.get(1),
            email: row.get(2),
        };
        println!("User {} is from {}", users.name, users.email);
    }

    Ok(())
}

async fn fetch_data_from_api() -> Result<(), reqwest::Error> {
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

#[tokio::main]
async fn main() {
    let postgres_task = tokio::spawn(fetch_data_from_postgres());
    let api_task = tokio::spawn(fetch_data_from_api());

    let (postgres_result, api_result) = tokio::join!(postgres_task, api_task);

    if let Err(err) = postgres_result.expect("Error in PostgreSQL task") {
        eprintln!("Error fetching data from PostgreSQL: {}", err);
    }

    if let Err(err) = api_result.expect("Error in API task") {
        eprintln!("Error fetching data from the API: {}", err);
    }
}
