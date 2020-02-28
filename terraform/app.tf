resource "google_app_engine_application" "indy-rest-service" {
    project = google_project.test.project_id
    location_id = var.region
}