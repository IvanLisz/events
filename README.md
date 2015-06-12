# Eventually

<h3>API's Endpoints:</h3>

*Event Endpoints:*
```javascript
get('/api/events/', index); //OPTIONAL ?limit=10&page=0&type= || next, now, old
get('/api/events/:id', show);
get('/api/events/name/:name', showByName); //OPTIONAL ?limit=10&page=0
post('/api/events/', isAuthenticated(), create);
put('/api/events/:id', isAuthenticated(), update);
patch('/api/events/:id', isAuthenticated(),update);
delete('/api/events/:id', isAuthenticated(), destroy);

get('/api/events/:id/quota', getQuota);
```

*User Endpoints:*
```javascript
get('/api/users/', hasRole('admin'), index);
delete('/api/users/:id', hasRole('admin'), destroy);
get('/api/users/me', isAuthenticated(), me);
put('/api/users/:id/password', isAuthenticated(), changePassword);
get('/api/users/:username', isAuthenticated(), show);
post('/api/users/', create);
```

*Favs Endpoints:*
```javascript
post('/api/favorites/add/:id', isAuthenticated(), add);
post('/api/favorites/remove/:id', isAuthenticated(), remove);
get('/api/favorites/list/:uid', list); //OPTIONAL ?limit=10&page=0
```

*Badges Endpoints:*
```javascript
get('/api/badges/', index);
get('/api/badges/:id', show);
```

*Tickets Endpoints:*
```javascript
post('/api/tickets/buy/:eid', isAuthenticated(), buy); //POST { tid: ticketID }
post('/api/tickets/cancel/:eid', isAuthenticated(), cancel); //POST { cancelIds: [_ids] }
post('/api/tickets/revert/:eid', isAuthenticated(), revert);
get('/api/tickets/list', isAuthenticated(), list); //OPTIONAL ?limit=10&page=0
```
