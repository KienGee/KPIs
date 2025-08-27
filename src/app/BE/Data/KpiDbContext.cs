using Microsoft.EntityFrameworkCore;
using KpiApi.Models;

namespace KpiApi.Data
{
    public class KpiDbContext : DbContext
    {
        public DbSet<AssignedKpi> AssignedKpis { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<EvaluationAttachment> EvaluationAttachments { get; set; }
        public DbSet<EvaluationPeriod> EvaluationPeriods { get; set; }
        public DbSet<FinalResult> FinalResults { get; set; }
        public DbSet<KpiEvaluation> KpiEvaluations { get; set; }
        public DbSet<Kpi> Kpis { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<User> Users { get; set; }

        public KpiDbContext(DbContextOptions<KpiDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table names
            modelBuilder.Entity<AssignedKpi>().ToTable("AssignedKpis");
            modelBuilder.Entity<Department>().ToTable("Departments");
            modelBuilder.Entity<EvaluationAttachment>().ToTable("EvaluationAttachments");
            modelBuilder.Entity<EvaluationPeriod>().ToTable("EvaluationPeriods");
            modelBuilder.Entity<FinalResult>().ToTable("FinalResults");
            modelBuilder.Entity<KpiEvaluation>().ToTable("KpiEvaluations");
            modelBuilder.Entity<Kpi>().ToTable("Kpis");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<UserRole>().ToTable("UserRoles");
            modelBuilder.Entity<User>().ToTable("Users");

            // Configure relationships
            modelBuilder.Entity<AssignedKpi>()
                .HasOne(a => a.Kpi)
                .WithMany(k => k.AssignedKpis)
                .HasForeignKey(a => a.KpiId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AssignedKpi>()
                .HasOne(a => a.Period)
                .WithMany(p => p.AssignedKpis)
                .HasForeignKey(a => a.PeriodId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AssignedKpi>()
                .HasOne(a => a.AssigneeUser)
                .WithMany(u => u.AssignedKpis)
                .HasForeignKey(a => a.AssigneeUserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AssignedKpi>()
                .HasOne(a => a.AssigneeDepartment)
                .WithMany(d => d.AssignedKpis)
                .HasForeignKey(a => a.AssigneeDepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            // Departments: Self-reference
            modelBuilder.Entity<Department>()
                .HasOne(d => d.ParentDepartment)
                .WithMany(d => d.ChildDepartments)
                .HasForeignKey(d => d.ParentDepartmentId)
                .OnDelete(DeleteBehavior.NoAction);

            // EvaluationAttachments
            modelBuilder.Entity<EvaluationAttachment>()
                .HasOne(e => e.Evaluation)
                .WithMany(k => k.Attachments)
                .HasForeignKey(e => e.EvaluationId)
                .OnDelete(DeleteBehavior.Cascade);

            // FinalResults
            modelBuilder.Entity<FinalResult>()
                .HasOne(f => f.Period)
                .WithMany(p => p.FinalResults)
                .HasForeignKey(f => f.PeriodId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FinalResult>()
                .HasOne(f => f.User)
                .WithMany(u => u.FinalResults)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FinalResult>()
                .HasOne(f => f.Department)
                .WithMany(d => d.FinalResults)
                .HasForeignKey(f => f.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            // KpiEvaluations
            modelBuilder.Entity<KpiEvaluation>()
                .HasOne(k => k.AssignedKpi)
                .WithMany(ak => ak.KpiEvaluations)
                .HasForeignKey(k => k.AssignedKpiId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserRoles (composite key)
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Users
            modelBuilder.Entity<User>()
                .HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasIndex(r => r.RoleName)
                .IsUnique();
        }
    }
}
