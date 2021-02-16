provider "cloudflare" {
    # api_key = "${var.cloudflare_api_key}"
}

resource "cloudflare_record" "rest-api" {
    zone_id = "94d5de375534b60ac33510017bc4fb6e"
    name = "${var.subdomain}rest-api"
    type = "CNAME"
    value = "ghs.googlehosted.com"
    proxied = true
}

resource "google_app_engine_domain_mapping" "main_domain" {
  domain_name       = "${var.subdomain}${var.service_name}.tykn.tech"
  project           = google_project.project.project_id
  
  override_strategy = ""

  ssl_settings {
    ssl_management_type = "AUTOMATIC"
  }
}