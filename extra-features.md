# Enable extra features

You can enable special features by adding more parameters to the redirectUri part of the iframe source URL:

## Add profile data

Start a check with pre-filled profile data

```javascript
document.getElementById('xund-iframe').src = `...&gender=male&birth=2000-12-31`
```

## Start check directly with illness, symptom or health check
If this is set, the welcome page is not visible on check restart. Possible values: `HEALTH_CHECK`, `ILLNESS_CHECK`, `SYMPTOM_CHECK`

```javascript
document.getElementById('xund-iframe').src = `...&directCheck=ILLNESS_CHECK`
```

## Continue check
In case of an aborted check you can implement your own checkId store mechanism and continue a check at the point the where the user left off:
```javascript
document.getElementById('xund-iframe').src = `...&checkId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
```
