import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { FormSchema, Field } from '../types';
import { validateField } from '../utils/validator';
import { evaluateFormula } from '../utils/derived';

export default function Preview(): JSX.Element {
  const [q] = useSearchParams();
  const paramId = useParams().id ?? q.get('formId');
  const forms = useAppSelector((s) => s.forms.list);
  const draftFields = useAppSelector((s) => s.builder.fields);

  const sourceForm = useMemo((): FormSchema | null => {
    if (paramId) {
      return forms.find((f) => f.id === paramId) ?? null;
    }
    return null;
  }, [forms, paramId]);

  const fields: Field[] = sourceForm ? sourceForm.fields : draftFields;

  const [values, setValues] = useState<Record<string, any>>(() => {
    const obj: Record<string, any> = {};
    for (const f of fields) obj[f.id] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
    return obj;
  });

  useEffect(() => {
    setValues((prev) => {
      const next: Record<string, any> = { ...prev };
      for (const f of fields) {
        if (!(f.id in next)) next[f.id] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fields.map(f => ({ id: f.id, defaultValue: f.defaultValue })))]);

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [snackOpen, setSnackOpen] = useState(false);

  // recompute derived fields when values/fields change
  useEffect(() => {
    const newVals = { ...values };
    for (const df of fields.filter((f) => f.derived && f.derived.parents?.length)) {
      const parents = df.derived!.parents;
      const mapping: Record<string, any> = {};
      parents.forEach((pid, idx) => { mapping[`p${idx + 1}`] = newVals[pid]; });
      const res = evaluateFormula(mapping, df.derived!.formula || '0');
      newVals[df.id] = res ?? '';
    }
    const changed = Object.keys(newVals).some((k) => String(newVals[k]) !== String(values[k]));
    if (changed) setValues(newVals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), JSON.stringify(fields.map(f => ({ id: f.id, derived: f.derived })))]);

  function onChange(id: string, v: any) {
    setValues((p) => ({ ...p, [id]: v }));
  }

  function runValidation() {
    const e: Record<string, string | null> = {};
    for (const f of fields) {
      const err = validateField(f, values[f.id]);
      e[f.id] = err;
    }
    setErrors(e);
    return Object.values(e).every((x) => x === null);
  }

  function handleSubmit() {
    if (runValidation()) {
      setSnackOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Preview</Typography>
      {fields.length === 0 && <Typography>No fields to preview</Typography>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {fields.map((f) => (
          <Box key={f.id}>
            {f.type === 'text' && (
              <TextField label={f.label} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} error={!!errors[f.id]} helperText={errors[f.id] || ''} fullWidth />
            )}
            {f.type === 'number' && (
              <TextField type="number" label={f.label} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} error={!!errors[f.id]} helperText={errors[f.id] || ''} fullWidth />
            )}
            {f.type === 'textarea' && (
              <TextField multiline rows={4} label={f.label} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} error={!!errors[f.id]} helperText={errors[f.id] || ''} fullWidth />
            )}
            {f.type === 'select' && (
              <TextField select label={f.label} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} error={!!errors[f.id]} helperText={errors[f.id] || ''} fullWidth>
                {(f.options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            )}
            {f.type === 'radio' && (
              <FormControl>
                <FormLabel>{f.label}</FormLabel>
                <RadioGroup value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)}>
                  {(f.options || []).map((o) => (
                    <FormControlLabel key={o} value={o} control={<Radio />} label={o} />
                  ))}
                </RadioGroup>
                {!!errors[f.id] && <Typography color="error" variant="body2">{errors[f.id]}</Typography>}
              </FormControl>
            )}
            {f.type === 'checkbox' && (
              <FormControlLabel control={<Checkbox checked={!!values[f.id]} onChange={(e) => onChange(f.id, e.target.checked)} />} label={f.label} />
            )}
            {f.type === 'date' && (
              <TextField type="date" label={f.label} InputLabelProps={{ shrink: true }} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} error={!!errors[f.id]} helperText={errors[f.id] || ''} fullWidth />
            )}
            {f.derived && (
              <TextField label={`${f.label} (derived)`} value={String(values[f.id] ?? '')} InputProps={{ readOnly: true }} fullWidth />
            )}
          </Box>
        ))}

        <Box>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Box>
      </Box>

      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => setSnackOpen(false)} message="Form valid — (no persistence of user inputs required)" />
    </Paper>
  );
}
