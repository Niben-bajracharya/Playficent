from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    bio = models.TextField(blank=True, default='')
    avatar_url = models.TextField(blank=True, default='')  # Stores base64 image data or URL
    total_games = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_played = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
    
    class Meta:
        ordering = ['-total_score']


class Leaderboard(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('normal', 'Normal'),
        ('hard', 'Hard'),
        ('insane', 'Insane'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_scores', null=True)
    username = models.CharField(max_length=150)
    score = models.IntegerField(default=0)
    wpm = models.FloatField(default=0.0)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='normal')
    accuracy = models.FloatField(default=0.0)  # Percentage (0-100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.score} ({self.difficulty})"
    
    class Meta:
        ordering = ['-score', '-timestamp']
        indexes = [
            models.Index(fields=['-score']),
            models.Index(fields=['username', '-score']),
            models.Index(fields=['difficulty', '-score']),
        ]


class GameSession(models.Model):
    """Detailed record of each game session"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_sessions', null=True)
    username = models.CharField(max_length=150)
    difficulty = models.CharField(max_length=10)
    score = models.IntegerField()
    wpm = models.FloatField()
    accuracy = models.FloatField(default=0.0)
    duration = models.IntegerField()  # seconds
    words_typed = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - Session {self.id}"
    
    class Meta:
        ordering = ['-timestamp']


class Achievement(models.Model):
    """Available achievements/badges"""
    TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50)  # emoji or icon name
    tier = models.CharField(max_length=10, choices=TIER_CHOICES, default='bronze')
    condition = models.CharField(max_length=50)  # e.g., 'score_100', 'streak_7'
    requirement = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['tier', 'requirement']


class UserAchievement(models.Model):
    """Track which achievements users have unlocked"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')
        ordering = ['-unlocked_at']

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"


class DailyStreak(models.Model):
    """Track user's daily play streaks"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='daily_streak')
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_played_date = models.DateField(null=True, blank=True)
    total_days_played = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - Streak: {self.current_streak}"


class ActivityLog(models.Model):
    """Admin activity tracking for system oversight"""
    ACTION_CHOICES = [
        ('user_created', 'User Created'),
        ('user_deleted', 'User Deleted'),
        ('user_role_changed', 'Role Changed'),
        ('game_submitted', 'Game Score Submitted'),
        ('achievement_unlocked', 'Achievement Unlocked'),
    ]
    
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    user = models.CharField(max_length=150)
    description = models.TextField()
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['action']),
        ]

    def __str__(self):
        return f"{self.action} - {self.user}"
