resource "google_app_engine_domain_mapping" "domain_mapping" {
  domain_name       = "${var.subdomain}.tykn.tech"
  project           = google_project.project.project_id
  override_strategy = ""

  ssl_settings {
    ssl_management_type = "AUTOMATIC"
  }
}