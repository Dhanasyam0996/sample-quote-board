from django.db import models

class Quote(models.Model):
    author = models.CharField(max_length=50)
    text = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author}: {self.text[:30]}"