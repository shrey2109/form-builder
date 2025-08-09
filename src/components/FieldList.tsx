import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  List,
  ListItem,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { removeField, reorderFields } from '../store/builderSlice';

export default function FieldList() {
  const fields = useAppSelector((s) => s.builder.fields);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">Fields</Typography>

      <List>
        {fields.map((f, idx) => (
          <ListItem
            key={f.id}
            secondaryAction={
              <Box>
                <IconButton
                  onClick={() =>
                    dispatch(
                      reorderFields({
                        fromIndex: idx,
                        toIndex: Math.max(0, idx - 1),
                      })
                    )
                  }
                  size="small"
                >
                  <ArrowUpwardIcon />
                </IconButton>

                <IconButton
                  onClick={() =>
                    dispatch(
                      reorderFields({
                        fromIndex: idx,
                        toIndex: Math.min(fields.length - 1, idx + 1),
                      })
                    )
                  }
                  size="small"
                >
                  <ArrowDownwardIcon />
                </IconButton>

                <IconButton
                  onClick={() => dispatch(removeField(f.id))}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <Typography>
              {idx + 1}. {f.label} ({f.type})
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
