import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addField,
  updateField,
  removeField,
  reorderFields,
  setSelected,
  setFields,
  resetBuilder,
} from '../store/builderSlice';
import { saveForm } from '../store/formsSlice';
import {
  Field,
  FieldType,
  ValidationKind,
  ValidationRule,
} from '../types';
import { saveDraft, loadDraft, clearDraft } from '../utils/localStorage';
import { detectCycle } from '../utils/derived';

const FIELD_TYPES: FieldType[] = [
  'text',
  'number',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'date',
  'derived',
];

function defaultValidations(): ValidationRule[] {
  return [
    { id: uuidv4(), kind: 'required', enabled: false },
    { id: uuidv4(), kind: 'minLength', value: 0, enabled: false },
    { id: uuidv4(), kind: 'maxLength', value: 100, enabled: false },
    { id: uuidv4(), kind: 'minValue', value: 0, enabled: false },
    { id: uuidv4(), kind: 'maxValue', value: 100, enabled: false },
    { id: uuidv4(), kind: 'email', enabled: false },
    { id: uuidv4(), kind: 'passwordRule', enabled: false },
  ];
}

export default function Create(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fields = useAppSelector((s) => s.builder.fields);
  const selectedId = useAppSelector((s) => s.builder.selectedId);
  const forms = useAppSelector((s) => s.forms.list);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedId) ?? null,
    [fields, selectedId]
  );

  // Save dialog state
  const [saveOpen, setSaveOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Restore draft on mount if builder empty
  useEffect(() => {
    try {
      const draft = loadDraft();
      if (draft?.fields && draft.fields.length && !fields.length) {
        dispatch(setFields(draft.fields));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist draft whenever fields change
  useEffect(() => {
    try {
      saveDraft({ fields });
    } catch {}
  }, [fields]);

  // Add new field
  function handleAdd(type: FieldType) {
    const f: Field = {
      id: uuidv4(),
      type,
      label: `${type} field`,
      required: false,
      defaultValue: type === 'checkbox' ? false : '',
      options:
        type === 'select' || type === 'radio' || type === 'checkbox'
          ? ['Option 1', 'Option 2']
          : [],
      validations: defaultValidations(),
      derived: type === 'derived' ? { parents: [], formula: '' } : null,
    };
    dispatch(addField(f));
  }

  function handleSelect(id: string) {
    dispatch(setSelected(id));
  }
  function handleRemove(id: string) {
    dispatch(removeField(id));
  }
  function moveUp(index: number) {
    if (index <= 0) return;
    dispatch(reorderFields({ fromIndex: index, toIndex: index - 1 }));
  }
  function moveDown(index: number) {
    if (index >= fields.length - 1) return;
    dispatch(reorderFields({ fromIndex: index, toIndex: index + 1 }));
  }

  function handleUpdate(patch: Partial<Field>) {
    if (!selectedField) return;
    dispatch(updateField({ id: selectedField.id, patch }));
  }

  function toggleValidation(kind: ValidationKind) {
    if (!selectedField) return;
    const nv = (selectedField.validations || []).map((v) =>
      v.kind === kind ? { ...v, enabled: !v.enabled } : v
    );
    handleUpdate({ validations: nv });
  }

  function setValidationValue(kind: ValidationKind, value: number) {
    if (!selectedField) return;
    const nv = (selectedField.validations || []).map((v) =>
      v.kind === kind ? { ...v, value } : v
    );
    handleUpdate({ validations: nv });
  }

  function setOptionsFromCsv(csv: string) {
    if (!selectedField) return;
    const opts = csv.split(',').map((s) => s.trim()).filter(Boolean);
    handleUpdate({ options: opts });
  }

  function setDerivedParents(csv: string) {
    if (!selectedField) return;
    const parents = csv.split(',').map((s) => s.trim()).filter(Boolean);
    handleUpdate({ derived: { ...(selectedField.derived ?? { parents: [], formula: '' }), parents } });
  }
  function setDerivedFormula(formula: string) {
    if (!selectedField) return;
    handleUpdate({ derived: { ...(selectedField.derived ?? { parents: [], formula: '' }), formula } });
  }

  function openSave() {
    setSaveError(null);
    setFormName('');
    setSaveOpen(true);
  }

  function doSave() {
    if (!formName.trim()) {
      setSaveError('Enter a form name');
      return;
    }
    const exists = forms.some((f) => f.name.trim().toLowerCase() === formName.trim().toLowerCase());
    if (exists) {
      setSaveError('Form name already exists. Choose another');
      return;
    }
    if (detectCycle(fields)) {
      setSaveError('Derived fields contain a cycle. Fix dependencies first.');
      return;
    }
    dispatch(saveForm({ name: formName.trim(), fields }));
    clearDraft();
    dispatch(resetBuilder());
    setSaveOpen(false);
    navigate('/myforms');
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Form Builder</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={openSave} disabled={fields.length === 0}>
            Save Form
          </Button>
          <Button variant="outlined" onClick={() => { dispatch(resetBuilder()); clearDraft(); }}>
            Clear
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper sx={{ p: 2, minWidth: 280 }}>
          <Typography variant="subtitle1">Add Field</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {FIELD_TYPES.map((t) => (
              <Button key={t} variant="outlined" onClick={() => handleAdd(t)} startIcon={<AddIcon />}>
                {t}
              </Button>
            ))}
          </Stack>

          <Box mt={2}>
            <Typography variant="subtitle2">Fields</Typography>
            <Stack spacing={1} mt={1}>
              {fields.map((f, idx) => (
                <Paper key={f.id} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSelect(f.id)}>
                    <Typography variant="body2">{idx + 1}. {f.label}</Typography>
                    <Typography variant="caption">{f.type}</Typography>
                  </Box>
                  <Tooltip title="Move up"><IconButton size="small" onClick={() => moveUp(idx)}><ArrowUpwardIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Move down"><IconButton size="small" onClick={() => moveDown(idx)}><ArrowDownwardIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" onClick={() => handleRemove(f.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle1">Field Editor</Typography>
          {!selectedField && <Typography>Select a field to edit</Typography>}
          {selectedField && (
            <Stack spacing={2} mt={1}>
              <TextField label="Label" value={selectedField.label} onChange={(e) => handleUpdate({ label: e.target.value })} />

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={selectedField.required ? 'Required: ON' : 'Required: OFF'} clickable color={selectedField.required ? 'primary' : 'default'} onClick={() => handleUpdate({ required: !selectedField.required })} />
                <TextField label="Default value" value={String(selectedField.defaultValue ?? '')} onChange={(e) => handleUpdate({ defaultValue: e.target.value })} />
              </Stack>

              {['select','radio','checkbox'].includes(selectedField.type) && (
                <Box>
                  <Typography variant="subtitle2">Options (comma separated)</Typography>
                  <TextField fullWidth value={selectedField.options.join(', ')} onChange={(e) => setOptionsFromCsv(e.target.value)} />
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2">Validations</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  <Chip variant={selectedField.validations.some(v => v.kind === 'required' && v.enabled) ? 'filled' : 'outlined'} label="Required" onClick={() => toggleValidation('required')} />
                  <Chip variant={selectedField.validations.some(v => v.kind === 'email' && v.enabled) ? 'filled' : 'outlined'} label="Email" onClick={() => toggleValidation('email')} />
                  <Chip variant={selectedField.validations.some(v => v.kind === 'passwordRule' && v.enabled) ? 'filled' : 'outlined'} label="Password rule" onClick={() => toggleValidation('passwordRule')} />
                </Stack>

                <Stack direction="row" spacing={1} mt={1} alignItems="center">
                  <Chip variant={selectedField.validations.some(v => v.kind === 'minLength' && v.enabled) ? 'filled' : 'outlined'} label="Min chars" onClick={() => toggleValidation('minLength')} />
                  <TextField disabled={!selectedField.validations.some(v => v.kind === 'minLength' && v.enabled)} type="number" size="small" value={selectedField.validations.find(v => v.kind === 'minLength')?.value ?? 0} onChange={(e) => setValidationValue('minLength', Number(e.target.value))} sx={{ width: 120 }} />

                  <Chip variant={selectedField.validations.some(v => v.kind === 'maxLength' && v.enabled) ? 'filled' : 'outlined'} label="Max chars" onClick={() => toggleValidation('maxLength')} />
                  <TextField disabled={!selectedField.validations.some(v => v.kind === 'maxLength' && v.enabled)} type="number" size="small" value={selectedField.validations.find(v => v.kind === 'maxLength')?.value ?? 100} onChange={(e) => setValidationValue('maxLength', Number(e.target.value))} sx={{ width: 120 }} />
                </Stack>

                {selectedField.type === 'number' && (
                  <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    <Chip variant={selectedField.validations.some(v => v.kind === 'minValue' && v.enabled) ? 'filled' : 'outlined'} label="Min value" onClick={() => toggleValidation('minValue')} />
                    <TextField disabled={!selectedField.validations.some(v => v.kind === 'minValue' && v.enabled)} type="number" size="small" value={selectedField.validations.find(v => v.kind === 'minValue')?.value ?? 0} onChange={(e) => setValidationValue('minValue', Number(e.target.value))} sx={{ width: 120 }} />

                    <Chip variant={selectedField.validations.some(v => v.kind === 'maxValue' && v.enabled) ? 'filled' : 'outlined'} label="Max value" onClick={() => toggleValidation('maxValue')} />
                    <TextField disabled={!selectedField.validations.some(v => v.kind === 'maxValue' && v.enabled)} type="number" size="small" value={selectedField.validations.find(v => v.kind === 'maxValue')?.value ?? 100} onChange={(e) => setValidationValue('maxValue', Number(e.target.value))} sx={{ width: 120 }} />
                  </Stack>
                )}
              </Box>

              {selectedField.type === 'derived' && (
                <Box>
                  <Typography variant="subtitle2">Derived Field</Typography>
                  <TextField fullWidth label="Parent IDs (comma separated)" value={(selectedField.derived?.parents || []).join(', ')} onChange={(e) => setDerivedParents(e.target.value)} />
                  <TextField fullWidth label="Formula (use p1,p2.. mapping)" multiline rows={3} value={selectedField.derived?.formula ?? ''} onChange={(e) => setDerivedFormula(e.target.value)} sx={{ mt: 1 }} />
                  <Typography variant="caption">Mapping: parents order → p1, p2, ...</Typography>
                </Box>
              )}
            </Stack>
          )}
        </Paper>
      </Stack>

      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Form name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          {saveError && <Typography color="error" sx={{ mt: 1 }}>{saveError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={doSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
