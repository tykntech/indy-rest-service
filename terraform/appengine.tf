resource "google_project" "test" {
    name = var.project_name
    project_id = var.project_id
    org_id = var.org_id
}
resource "google_app_engine_application" "indy-rest-service" {
    project = google_project.test.project_id
    location_id = var.region
}