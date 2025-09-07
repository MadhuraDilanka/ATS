using Microsoft.EntityFrameworkCore;
using api.Core.Entities;
using ApplicationEntity = api.Core.Entities.Application;

namespace api.Infrastructure.Data;

public class ATSDbContext : DbContext
{
    public ATSDbContext(DbContextOptions<ATSDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<JobSkill> JobSkills { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<CandidateSkill> CandidateSkills { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<ApplicationEntity> Applications { get; set; }
    public DbSet<Interview> Interviews { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<ApplicationDocument> ApplicationDocuments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Requirements).IsRequired();
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Department).IsRequired().HasMaxLength(100);
            entity.Property(e => e.SalaryMin).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SalaryMax).HasColumnType("decimal(18,2)");

            entity.HasOne(j => j.HiringManager)
                  .WithMany(u => u.JobsCreated)
                  .HasForeignKey(j => j.HiringManagerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<JobSkill>(entity =>
        {
            entity.HasKey(js => new { js.JobId, js.SkillId });
            
            entity.HasOne(js => js.Job)
                  .WithMany(j => j.JobSkills)
                  .HasForeignKey(js => js.JobId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(js => js.Skill)
                  .WithMany(s => s.JobSkills)
                  .HasForeignKey(js => js.SkillId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ExpectedSalary).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<CandidateSkill>(entity =>
        {
            entity.HasKey(cs => new { cs.CandidateId, cs.SkillId });
            
            entity.HasOne(cs => cs.Candidate)
                  .WithMany(c => c.CandidateSkills)
                  .HasForeignKey(cs => cs.CandidateId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(cs => cs.Skill)
                  .WithMany(s => s.CandidateSkills)
                  .HasForeignKey(cs => cs.SkillId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Experience>(entity =>
        {
            entity.Property(e => e.JobTitle).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Company).IsRequired().HasMaxLength(200);

            entity.HasOne(e => e.Candidate)
                  .WithMany(c => c.Experiences)
                  .HasForeignKey(e => e.CandidateId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Education>(entity =>
        {
            entity.Property(e => e.Institution).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Degree).IsRequired().HasMaxLength(200);

            entity.HasOne(e => e.Candidate)
                  .WithMany(c => c.Educations)
                  .HasForeignKey(e => e.CandidateId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ApplicationEntity>(entity =>
        {
            entity.HasOne(a => a.Job)
                  .WithMany(j => j.Applications)
                  .HasForeignKey(a => a.JobId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Candidate)
                  .WithMany(c => c.Applications)
                  .HasForeignKey(a => a.CandidateId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Reviewer)
                  .WithMany(u => u.Applications)
                  .HasForeignKey("ReviewerId")
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Interview>(entity =>
        {
            entity.HasOne(i => i.Application)
                  .WithMany(a => a.Interviews)
                  .HasForeignKey(i => i.ApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Interviewer)
                  .WithMany(u => u.InterviewsAsInterviewer)
                  .HasForeignKey(i => i.InterviewerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.Property(d => d.FileName).IsRequired().HasMaxLength(255);
            entity.Property(d => d.FileType).IsRequired().HasMaxLength(50);
            entity.Property(d => d.FilePath).IsRequired().HasMaxLength(500);
            entity.Property(d => d.DocumentType).IsRequired().HasMaxLength(50);

            entity.HasOne(d => d.Candidate)
                  .WithMany(c => c.Documents)
                  .HasForeignKey(d => d.CandidateId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ApplicationDocument>(entity =>
        {
            entity.HasKey(ad => new { ad.ApplicationId, ad.DocumentId });

            entity.HasOne(ad => ad.Application)
                  .WithMany(a => a.ApplicationDocuments)
                  .HasForeignKey(ad => ad.ApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ad => ad.Document)
                  .WithMany(d => d.ApplicationDocuments)
                  .HasForeignKey(ad => ad.DocumentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property<DateTime>("CreatedAt")
                    .HasDefaultValueSql("GETUTCDATE()");

                modelBuilder.Entity(entityType.ClrType)
                    .Property<DateTime>("UpdatedAt")
                    .HasDefaultValueSql("GETUTCDATE()");
            }
        }
    }
}
