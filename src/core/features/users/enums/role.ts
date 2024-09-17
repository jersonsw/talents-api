export enum Role {
  // Platform Roles
  PlatformDeveloper = 'developer',
  PlatformAdmin = 'admin',
  PlatformUser = 'user',

  // HR Roles
  HumanResourcesManager = 'human_resources_manager',
  HumanResourcesRecruiter = 'human_resources_recruiter',
  HumanResourcesEmployee = 'human_resources_employee',

  HumanResourcesCreateApplicant = 'human_resources_create_applicant',
  HumanResourcesReadApplicant = 'human_resources_read_applicant',
  HumanResourcesUpdateApplicant = 'human_resources_update_applicant',
  HumanResourcesDeleteApplicant = 'human_resources_delete_applicant',
  HumanResourcesApproveApplicant = 'human_resources_approve_applicant',

  // Software Development Roles
  DevelopmentManager = 'development_manager',
}
