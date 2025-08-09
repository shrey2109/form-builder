import React from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteForm } from '../store/formsSlice';
import { useNavigate } from 'react-router-dom';

export default function MyForms(): JSX.Element {
  const forms = useAppSelector((s) => s.forms.list);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  if (!forms || forms.length === 0) {
    return <Typography>No saved forms.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {forms.map((f) => (
        <Grid item xs={12} md={6} key={f.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{f.name}</Typography>
              <Typography variant="body2">{format(new Date(f.createdAt), 'PPpp')}</Typography>
              <Box mt={1}>
                <Button variant="contained" onClick={() => nav(`/preview/${f.id}`)}>Open</Button>
                <Button variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => dispatch(deleteForm(f.id))}>Delete</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
