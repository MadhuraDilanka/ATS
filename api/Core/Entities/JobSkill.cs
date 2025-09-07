namespace api.Core.Entities;

public class JobSkill : BaseEntity
{
    public int JobId { get; set; }
    public int SkillId { get; set; }
    public bool IsRequired { get; set; }
    public int YearsOfExperience { get; set; }
    
    public virtual Job Job { get; set; } = null!;
    public virtual Skill Skill { get; set; } = null!;
}
