provider "google" {  
  credentials = file("../client-secret.json")
  region      = var.region
}