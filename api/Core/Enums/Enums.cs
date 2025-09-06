namespace api.Core.Enums;

public enum UserRole
{
    HR = 1,
    Manager = 2,
    Candidate = 3
}

public enum ApplicationStatus
{
    Applied = 1,
    ScreeningInProgress = 2,
    InterviewScheduled = 3,
    InterviewCompleted = 4,
    OfferExtended = 5,
    Hired = 6,
    Rejected = 7,
    Withdrawn = 8
}

public enum InterviewType
{
    Phone = 1,
    Video = 2,
    InPerson = 3,
    Technical = 4,
    HR = 5,
    Final = 6
}

public enum InterviewStatus
{
    Scheduled = 1,
    InProgress = 2,
    Completed = 3,
    Cancelled = 4,
    Rescheduled = 5
}

public enum JobStatus
{
    Draft = 1,
    Active = 2,
    Paused = 3,
    Closed = 4,
    Cancelled = 5
}

public enum ExperienceLevel
{
    Entry = 1,
    Junior = 2,
    Mid = 3,
    Senior = 4,
    Lead = 5,
    Principal = 6
}

public enum EmploymentType
{
    FullTime = 1,
    PartTime = 2,
    Contract = 3,
    Temporary = 4,
    Internship = 5
}
