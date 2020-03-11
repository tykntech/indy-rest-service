resource "google_app_engine_domain_mapping" "main_domain" {
  domain_name       = "${var.subdomain}${var.service_name}.api.tykn.tech"
  project           = google_project.project.project_id
  
  override_strategy = ""

  ssl_settings {
    ssl_management_type = "AUTOMATIC"
  }
}