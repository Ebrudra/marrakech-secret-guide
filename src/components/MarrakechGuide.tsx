Here's the fixed version with the missing closing brackets:

```jsx
        ) : showNotifications ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowNotifications(false)}
                className="mb-4"
              >
                ← {t.backToGuide}
              </Button>
            </div>
            <NotificationManager language={language} />
          </div>
        ) : showAIPlanner ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowAIPlanner(false)}
                className="mb-4"
              >
                ← {t.backToGuide}
              </Button>
            </div>
            <AIItineraryPlanner 
              language={language} 
              availableActivities={getAllActivities()}
            />
          </div>
```

The issue was in the nested conditional rendering where a closing parenthesis and curly brace were missing after the NotificationManager section. I've added them to properly close the conditional statement.