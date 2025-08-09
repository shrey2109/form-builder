import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateField } from '../store/builderSlice';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Button,
} from '@mui/material';
import { Field } from '../types';

export default function FieldEditor() {
  const fields = useAppSelector((s) => s.builder.fields);
  const dispatch = useAppDispatch();
  const field = fields[0] || null;

  if (!field) {
    return <Typography>No field to edit. Add one.</Typography>;
  }

  return <FieldEditorForm field={field} />;
}

function FieldEditorForm({ field }: { field: Field }) {
  const dispatch = useAppDispatch();

  const update = (patch: Partial<Field>) =>
    dispatch(updateField({ id: field.id, patch }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => update({ label: e.target.value })}
      />

      <FormControlLabel
        control={
          <Switch
            checked={!!field.required}
            onChange={(e) => update({ required: e.target.checked })}
          />
        }
        label="Required"
      />

      <TextField
        label="Default value"
        value={field.defaultValue || ''}
        onChange={(e) => update({ defaultValue: e.target.value })}
      />

      <Box>
        <Typography variant="subtitle2">Validations (toggle)</Typography>
      </Box>

      {(field.type === 'select' || field.type === 'radio') && (
        <Box>
          <Typography variant="subtitle2">
            Options (comma separated)
          </Typography>
          <TextField
            value={(field.options || []).join(',')}
            onChange={(e) =>
              update({
                options: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
        </Box>
      )}

      {field.type === 'derived' && (
        <Box>
          <Typography variant="subtitle2">Derived settings</Typography>
          <TextField
            label="Parents (comma separated ids)"
            value={field.derived?.parents.join(',') || ''}
            onChange={(e) =>
              update({
                derived: {
                  parents: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  formula: field.derived?.formula || '',
                },
              })
            }
          />
          <TextField
            label="Formula (use p1,p2)"
            value={field.derived?.formula || ''}
            onChange={(e) =>
              update({
                derived: {
                  ...(field.derived || { parents: [] }),
                  formula: e.target.value,
                },
              })
            }
          />
        </Box>
      )}

      <Button variant="contained" onClick={() => alert('Field saved')}>
        Save Field
      </Button>
    </Box>
  );
}
