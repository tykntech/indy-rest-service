provider "google" {
  credentials = var.credentials[var.environment]
  region      = var.region
}