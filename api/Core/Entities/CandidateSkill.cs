namespace api.Core.Entities;

public class CandidateSkill : BaseEntity
{
    public int CandidateId { get; set; }
    public int SkillId { get; set; }
    public int YearsOfExperience { get; set; }
    public int ProficiencyLevel { get; set; }
    
    public virtual Candidate Candidate { get; set; } = null!;
    public virtual Skill Skill { get; set; } = null!;
}
