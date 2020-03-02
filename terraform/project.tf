resource "google_project" "test" {
    name = var.project_name
    project_id = var.project_id
    org_id = var.org_id
}