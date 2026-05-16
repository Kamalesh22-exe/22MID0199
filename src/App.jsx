import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Card, CardContent, Chip, 
  FormControl, InputLabel, Select, MenuItem, Pagination, 
  CircularProgress, Button, Grid, Badge
} from '@mui/material'
import { Notifications, FiberNew, Visibility } from '@mui/icons-material'

function App() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [typeFilter, setTypeFilter] = useState('')
  const [viewedIds, setViewedIds] = useState(new Set())

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        let url = `/api/evaluation-service/notifications?limit=${limit}&page=${page}`
        if (typeFilter) {
          url += `&notification_type=${typeFilter}`
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer 22MID0199',
            'token': '22MID0199',
            'rollNumber': '22MID0199',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setNotifications(data.notifications || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [page, limit, typeFilter])

  const getTypeColor = (type) => {
    switch (type) {
      case 'Placement': return 'error'
      case 'Result': return 'warning'
      case 'Event': return 'info'
      default: return 'default'
    }
  }

  const markAsRead = (id) => {
    setViewedIds(prev => new Set([...prev, id]))
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Notifications color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">Campus Notifications Portal</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Notification Type</InputLabel>
            <Select
              value={typeFilter}
              label="Notification Type"
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            >
              <MenuItem value="">All Notifications</MenuItem>
              <MenuItem value="Placement">Placements</MenuItem>
              <MenuItem value="Result">Results</MenuItem>
              <MenuItem value="Event">Events</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Items Per Page</InputLabel>
            <Select
              value={limit}
              label="Items Per Page"
              onChange={(e) => { setLimit(e.target.value); setPage(1); }}
            >
              <MenuItem value={5}>5 Items</MenuItem>
              <MenuItem value={10}>10 Items</MenuItem>
              <MenuItem value={15}>15 Items</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center" my={4}>
          No notifications found matching the criteria.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {notifications.map((notif) => {
            const isRead = viewedIds.has(notif.ID)
            return (
              <Card 
                key={notif.ID} 
                variant="outlined"
                sx={{ 
                  borderColor: isRead ? 'divider' : 'primary.main',
                  backgroundColor: isRead ? 'action.hover' : 'background.paper',
                  transition: 'all 0.2s ease'
                }}
              >
                <CardContent sx={{ position: 'relative', '&:last-child': { pb: 2 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {!isRead && (
                        <Badge color="primary" variant="dot" sx={{ mr: 1 }}>
                          <FiberNew color="primary" />
                        </Badge>
                      )}
                      <Chip 
                        label={notif.Type} 
                        color={getTypeColor(notif.Type)} 
                        size="small" 
                        fontWeight="bold"
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notif.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mt: 1.5, mb: 2, fontWeight: isRead ? 400 : 500 }}>
                    {notif.Message}
                  </Typography>

                  <Box display="flex" justifyContent="end">
                    <Button 
                      size="small" 
                      startIcon={<Visibility />} 
                      variant={isRead ? "text" : "outlined"}
                      color={isRead ? "inherit" : "primary"}
                      disabled={isRead}
                      onClick={() => markAsRead(notif.ID)}
                    >
                      {isRead ? "Viewed" : "Mark as Viewed"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination 
          count={5} 
          page={page} 
          onChange={(e, value) => setPage(value)} 
          color="primary" 
        />
      </Box>
    </Container>
  )
}

export default App