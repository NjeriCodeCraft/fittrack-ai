import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Generate synthetic training dataset
np.random.seed(42)
n = 500

ages = np.random.randint(18, 60, n)
bmis = np.random.uniform(16, 40, n)
weekly_activity = np.random.randint(0, 8, n)
avg_duration = np.random.randint(10, 120, n)

# Label activity level based on rules
def label(age, bmi, freq, duration):
    score = (freq * 0.4) + (duration / 120 * 0.4) + ((30 - abs(bmi - 22)) / 30 * 0.2)
    if score < 0.25:
        return 'sedentary'
    elif score < 0.45:
        return 'lightly_active'
    elif score < 0.65:
        return 'moderately_active'
    else:
        return 'highly_active'

labels = [label(ages[i], bmis[i], weekly_activity[i], avg_duration[i]) for i in range(n)]

df = pd.DataFrame({
    'age': ages,
    'bmi': bmis,
    'weekly_activity': weekly_activity,
    'avg_duration': avg_duration,
    'activity_level': labels
})

# Save dataset
df.to_csv('ai_module/fitness_dataset.csv', index=False)
print("Dataset created:", df['activity_level'].value_counts().to_dict())

# Train model
X = df[['age', 'bmi', 'weekly_activity', 'avg_duration']]
y = df['activity_level']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model accuracy: {accuracy * 100:.1f}%")

# Save model
joblib.dump(model, 'ai_module/fitness_model.pkl')
print("Model saved to ai_module/fitness_model.pkl")