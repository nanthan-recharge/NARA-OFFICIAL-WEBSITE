import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useController, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, FileText, Check, Plus, Trash2, Info, ListChecks } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const toTitleCase = (value = '') =>
  value
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1));

const normalizeKey = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const createTableRowDefaults = (columns = []) =>
  columns.reduce((acc, column) => {
    acc[column.column_name] = '';
    return acc;
  }, {});

const createSectionEntryDefaults = (section = {}) =>
  (section.fields || []).reduce((acc, field) => {
    acc[field.field_name] = '';
    return acc;
  }, {});

const deriveFieldLabel = (field = {}, fallbackKey = '') => {
  if (field.field_label) return field.field_label;
  if (field.description) return field.description;
  if (field.instruction) {
    return field.instruction.replace(/\[.*?\]/g, '').trim();
  }
  if (field.title) return field.title;
  return toTitleCase(field.field_name || fallbackKey);
};

const parseLetterStructure = (formData = {}) => {
  const headerFields = (formData.header_fields || []).map((field) => ({
    ...field,
    field_label: field.field_label || toTitleCase(field.field_name),
    field_type: field.field_type || 'text',
    default: field.default
  }));

  const content = formData.content || {};
  const contentTextBlocks = [];
  const contentFields = [];
  const contentGroups = [];
  let mannerOptions = null;

  Object.entries(content).forEach(([key, value]) => {
    if (key === 'manner_options' && Array.isArray(value)) {
      mannerOptions = {
        name: 'manner_options',
        label: 'Manner in which information is provided',
        options: value
      };
      return;
    }

    if (key === 'reasons_section' && value) {
      const fields = (value.reason_fields || []).map((reason) => ({
        field_name: reason.field_name,
        field_label: reason.reason_number
          ? `Reason ${reason.reason_number}`
          : deriveFieldLabel(reason, reason.field_name),
        field_type: reason.field_type || 'textarea',
        rows: reason.rows || 4
      }));

      contentGroups.push({
        key,
        title: value.title || toTitleCase(key),
        note: value.note,
        fields
      });
      return;
    }

    if (key === 'extension_details' && value) {
      const fields = Object.values(value)
        .filter((item) => item && item.field_name)
        .map((item) => ({
          field_name: item.field_name,
          field_label: item.field_label || deriveFieldLabel(item, item.field_name),
          field_type: item.field_type || 'text'
        }));

      if (fields.length > 0) {
        contentGroups.push({
          key,
          title: 'Extension Details',
          fields
        });
      }
      return;
    }

    if (key === 'payment_instruction' && value && value.field_name) {
      contentFields.push({
        field_name: value.field_name,
        field_label: 'Fee Amount (Rs.)',
        field_type: value.field_type || 'text',
        note: value.instruction
      });
      return;
    }

    if (value && typeof value === 'object' && !Array.isArray(value) && value.field_name) {
      contentFields.push({
        field_name: value.field_name,
        field_label: deriveFieldLabel(value, key),
        field_type: value.field_type || 'text',
        rows: value.rows,
        note: value.description || value.note
      });
      return;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (key === 'third_party_rights') {
        contentTextBlocks.push(...Object.values(value));
      }
      return;
    }

    if (typeof value === 'string') {
      contentTextBlocks.push(value);
    }
  });

  const designatedOfficerFields = formData.designated_officer
    ? Object.entries(formData.designated_officer).map(([key, label]) => ({
        sectionKey: 'designated_officer',
        field_key: key,
        field_name: key,
        field_label: label,
        field_type:
          key.includes('address') || key.includes('contact') ? 'textarea' : 'text'
      }))
    : [];

  const contactSections = [];
  if (formData.contact_info) {
    Object.entries(formData.contact_info).forEach(([sectionKey, info]) => {
      const fields = Object.entries(info).map(([key, label]) => ({
        field_name: key,
        field_label: label,
        field_type:
          key.includes('address') || key.includes('contact') ? 'textarea' : 'text'
      }));

      contactSections.push({
        sectionKey,
        title: toTitleCase(sectionKey),
        fields
      });
    });
  }

  const closingFields = formData.closing
    ? Object.entries(formData.closing).map(([key, label]) => ({
        field_name: key,
        field_label: label,
        field_type: key.toLowerCase().includes('date') ? 'date' : 'text'
      }))
    : [];

  return {
    headerFields,
    contentTextBlocks,
    contentFields,
    contentGroups,
    mannerOptions,
    designatedOfficerFields,
    contactSections,
    closingFields
  };
};

const buildDefaultValues = (formData) => {
  const defaults = {};
  const letterStructure = parseLetterStructure(formData);

  if (formData?.fields) {
    formData.fields.forEach((field) => {
      switch (field.field_type) {
        case 'checkbox':
        case 'list':
          defaults[field.field_name] = [];
          break;
        case 'group':
          defaults[field.field_name] = {};
          field.subfields?.forEach((subfield) => {
            defaults[field.field_name][subfield.subfield_name] = '';
          });
          break;
        default:
          defaults[field.field_name] = '';
      }

      if (field.conditional?.if_yes) {
        defaults[field.conditional.if_yes.field_name] = '';
      }
    });
  }

  if (formData?.table_columns) {
    defaults.tableRows = [createTableRowDefaults(formData.table_columns)];
  }

  if (formData?.sections) {
    formData.sections.forEach((section) => {
      const sectionKey = normalizeKey(section.section_name);
      defaults[sectionKey] = [
        createSectionEntryDefaults(section)
      ];
    });
  }

  if (letterStructure.headerFields.length > 0) {
    defaults.header = {};
    letterStructure.headerFields.forEach((field) => {
      defaults.header[field.field_name] = field.default || '';
    });
  }

  if (
    letterStructure.contentFields.length > 0 ||
    letterStructure.contentGroups.length > 0 ||
    letterStructure.mannerOptions
  ) {
    defaults.content = defaults.content || {};

    letterStructure.contentFields.forEach((field) => {
      defaults.content[field.field_name] = field.default || '';
    });

    letterStructure.contentGroups.forEach((group) => {
      group.fields.forEach((field) => {
        defaults.content[field.field_name] = field.default || '';
      });
    });

    if (letterStructure.mannerOptions) {
      defaults.content[letterStructure.mannerOptions.name] = [];
    }
  }

  if (letterStructure.designatedOfficerFields.length > 0) {
    defaults.designated_officer = {};
    letterStructure.designatedOfficerFields.forEach((field) => {
      defaults.designated_officer[field.field_name] = '';
    });
  }

  if (letterStructure.contactSections.length > 0) {
    defaults.contact_info = {};
    letterStructure.contactSections.forEach((section) => {
      defaults.contact_info[section.sectionKey] = {};
      section.fields.forEach((field) => {
        defaults.contact_info[section.sectionKey][field.field_name] = '';
      });
    });
  }

  if (letterStructure.closingFields.length > 0) {
    defaults.closing = {};
    letterStructure.closingFields.forEach((field) => {
      defaults.closing[field.field_name] = '';
    });
  }

  if (formData?.signature_section) {
    const { date, signature } = formData.signature_section;
    defaults.signature = {
      [normalizeKey(date) || 'date']: '',
      [normalizeKey(signature) || 'signature']: ''
    };
  }

  if (formData?.footer) {
    defaults.footer = Object.keys(formData.footer).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
  }

  return defaults;
};

const transformSubmission = (values, formData) => {
  const submission = {
    formId: formData?.form_id,
    formName: formData?.form_name,
    submittedAt: new Date().toISOString()
  };

  const fieldsPayload = {};

  if (formData?.fields) {
    formData.fields.forEach((field) => {
      const value = values[field.field_name];
      if (field.field_type === 'list') {
        fieldsPayload[field.field_name] = Array.isArray(value) ? value : [];
      } else if (field.field_type === 'group') {
        fieldsPayload[field.field_name] = value || {};
      } else {
        fieldsPayload[field.field_name] = value ?? '';
      }

      if (field.conditional?.if_yes) {
        fieldsPayload[field.conditional.if_yes.field_name] =
          values[field.conditional.if_yes.field_name] ?? '';
      }
    });
  }

  if (Object.keys(fieldsPayload).length > 0) {
    submission.fields = fieldsPayload;
  }

  if (formData?.table_columns && Array.isArray(values.tableRows)) {
    submission.tableRows = values.tableRows;
  }

  if (formData?.sections) {
    const sectionsPayload = {};
    formData.sections.forEach((section) => {
      const key = normalizeKey(section.section_name);
      const sectionValue = values[key];
      if (sectionValue) {
        sectionsPayload[section.section_name] = sectionValue;
      }
    });

    if (Object.keys(sectionsPayload).length > 0) {
      submission.sections = sectionsPayload;
    }
  }

  if (values.signature) {
    submission.signature = values.signature;
  }

  if (values.footer) {
    submission.footer = values.footer;
  }

  if (values.header && Object.keys(values.header).length > 0) {
    submission.header = values.header;
  }

  if (values.content && Object.keys(values.content).length > 0) {
    submission.content = values.content;
  }

  if (values.designated_officer && Object.keys(values.designated_officer).length > 0) {
    submission.designatedOfficer = values.designated_officer;
  }

  if (values.contact_info && Object.keys(values.contact_info).length > 0) {
    submission.contactInfo = values.contact_info;
  }

  if (values.closing && Object.keys(values.closing).length > 0) {
    submission.closing = values.closing;
  }

  return submission;
};

const CheckboxGroupField = ({ field, control }) => {
  const {
    field: controller,
    fieldState: { error }
  } = useController({
    name: field.field_name,
    control,
    defaultValue: [],
    rules: field.required
      ? {
          validate: (value) =>
            Array.isArray(value) && value.length > 0
              ? true
              : 'Please select at least one option'
        }
      : undefined
  });

  const toggleOption = (option) => {
    const current = controller.value || [];
    if (current.includes(option)) {
      controller.onChange(current.filter((item) => item !== option));
    } else {
      controller.onChange([...current, option]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        {(field.options || []).map((option) => {
          const checked = controller.value?.includes(option);
          return (
            <button
              type="button"
              key={option}
              onClick={() => toggleOption(option)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                checked
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span className="font-medium text-sm md:text-base">{option}</span>
              {checked && <Check className="h-5 w-5 text-blue-600" />}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

const ListInputField = ({ field, control }) => {
  const [inputValue, setInputValue] = useState('');
  const {
    field: controller,
    fieldState: { error }
  } = useController({
    name: field.field_name,
    control,
    defaultValue: [],
    rules: field.required
      ? {
          validate: (value) =>
            Array.isArray(value) && value.length > 0
              ? true
              : 'Please add at least one item'
        }
      : undefined
  });

  const maxItems = field.max_items || 5;
  const items = controller.value || [];
  const limitReached = items.length >= maxItems;

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || limitReached) return;
    controller.onChange([...items, trimmed]);
    setInputValue('');
  };

  const removeItem = (index) => {
    controller.onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter item and press Add"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          disabled={limitReached}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={limitReached}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {limitReached && (
        <p className="text-xs font-medium text-blue-600">
          Maximum of {maxItems} items reached.
        </p>
      )}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full bg-blue-100 p-1 text-blue-600 transition hover:bg-blue-200"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

const TableBuilder = ({ columns, control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tableRows'
  });

  const addRow = () => {
    append(createTableRowDefaults(columns));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.column_name}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  {column.column_label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {fields.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-slate-50/60">
                {columns.map((column) => (
                  <td key={column.column_name} className="px-4 py-3 align-top">
                    <input
                      type={column.data_type === 'date' ? 'date' : 'text'}
                      {...register(`tableRows.${rowIndex}.${column.column_name}`, {
                        required: column.required
                          ? `${column.column_label} is required`
                          : false
                      })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      placeholder={column.column_label}
                    />
                    {errors?.tableRows?.[rowIndex]?.[column.column_name] && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.tableRows[rowIndex][column.column_name].message}
                      </p>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => remove(rowIndex)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add another row
      </button>
    </div>
  );
};

const SectionBlock = ({ section, control, register, errors }) => {
  const sectionKey = normalizeKey(section.section_name);
  const { fields, append, remove } = useFieldArray({
    control,
    name: sectionKey
  });

  const canAddMore = section.repeatable || fields.length === 0;

  const handleAdd = () => {
    append(createSectionEntryDefaults(section));
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-blue-100 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-700">
            {section.section_name}
          </h3>
          {section.repeatable && (
            <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
              Repeatable section
            </p>
          )}
        </div>
        {section.repeatable && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </button>
        )}
      </div>

      <div className="mt-4 space-y-6">
        {fields.map((fieldGroup, groupIndex) => (
          <div
            key={fieldGroup.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            {section.repeatable && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Entry {groupIndex + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(groupIndex)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                )}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {(section.fields || []).map((field) => {
                const fieldName = `${sectionKey}.${groupIndex}.${field.field_name}`;
                const fieldError =
                  errors?.[sectionKey]?.[groupIndex]?.[field.field_name];

                const sharedProps = {
                  ...register(fieldName, {
                    required: field.required
                      ? `${field.field_label} is required`
                      : false
                  }),
                  className:
                    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300',
                  placeholder: field.field_label
                };

                if (field.field_type === 'textarea') {
                  return (
                    <div key={field.field_name} className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        {field.field_label}
                      </label>
                      <textarea
                        {...sharedProps}
                        rows={field.rows || 4}
                      />
                      {fieldError && (
                        <p className="text-sm text-red-500">{fieldError.message}</p>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={field.field_name} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {field.field_label}
                    </label>
                    <input
                      {...sharedProps}
                      type={field.field_type === 'date' ? 'date' : 'text'}
                    />
                    {fieldError && (
                      <p className="text-sm text-red-500">{fieldError.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {canAddMore && !section.repeatable && fields.length === 0 && (
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add details
        </button>
      )}
    </div>
  );
};

const FieldRenderer = ({
  field,
  register,
  errors,
  control,
  watch
}) => {
  const error = errors?.[field.field_name];
  const fieldLabel = field.field_label || field.field_name;

  const baseClasses =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';

  if (field.field_type === 'group') {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
              <ListChecks className="h-4 w-4" />
              {field.field_number && (
                <span className="text-xs font-bold text-blue-500">
                  {field.field_number}
                </span>
              )}
              <span>{fieldLabel}</span>
            </div>
            {field.description && (
              <p className="mt-1 text-sm text-slate-500">{field.description}</p>
            )}
          </div>
        </div>

        {(field.subfields || []).map((subfield) => {
          const subFieldName = `${field.field_name}.${subfield.subfield_name}`;
          const subError = error?.[subfield.subfield_name];

          return (
            <div key={subfield.subfield_name} className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {subfield.subfield_label}
              </label>
              {subfield.field_type === 'textarea' ? (
                <textarea
                  {...register(subFieldName)}
                  rows={subfield.rows || 4}
                  className={baseClasses}
                  placeholder={subfield.subfield_label}
                />
              ) : (
                <input
                  {...register(subFieldName)}
                  type={subfield.field_type === 'date' ? 'date' : 'text'}
                  className={baseClasses}
                  placeholder={subfield.subfield_label}
                />
              )}
              {subError && (
                <p className="text-sm text-red-500">{subError.message}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (field.field_type === 'checkbox') {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {field.field_number && (
            <span className="text-xs font-bold uppercase tracking-wide text-blue-500">
              {field.field_number}
            </span>
          )}
          <span>{fieldLabel}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <CheckboxGroupField field={field} control={control} />
        {field.note && (
          <p className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <Info className="h-3 w-3" />
            {field.note}
          </p>
        )}
      </div>
    );
  }

  if (field.field_type === 'list') {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {field.field_number && (
            <span className="text-xs font-bold uppercase tracking-wide text-blue-500">
              {field.field_number}
            </span>
          )}
          <span>{fieldLabel}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <ListInputField field={field} control={control} />
        {field.note && (
          <p className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <Info className="h-3 w-3" />
            {field.note}
          </p>
        )}
      </div>
    );
  }

  if (field.field_type === 'radio') {
    const selectedValue = watch(field.field_name);
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {field.field_number && (
            <span className="text-xs font-bold uppercase tracking-wide text-blue-500">
              {field.field_number}
            </span>
          )}
          <span>{fieldLabel}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {(field.options || []).map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                selectedValue === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <input
                type="radio"
                value={option}
                {...register(field.field_name, {
                  required: field.required ? 'Please make a selection' : false
                })}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-sm text-red-500">{error.message}</p>}

        {field.conditional?.if_yes && selectedValue === 'Yes' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <label className="mb-2 block text-sm font-semibold text-blue-700">
              {field.conditional.if_yes.field_label}
            </label>
            {field.conditional.if_yes.field_type === 'textarea' ? (
              <textarea
                {...register(field.conditional.if_yes.field_name)}
                rows={field.conditional.if_yes.rows || 4}
                className={baseClasses}
                placeholder={field.conditional.if_yes.field_label}
              />
            ) : (
              <input
                {...register(field.conditional.if_yes.field_name)}
                type={
                  field.conditional.if_yes.field_type === 'date'
                    ? 'date'
                    : 'text'
                }
                className={baseClasses}
                placeholder={field.conditional.if_yes.field_label}
              />
            )}
          </div>
        )}
        {field.note && (
          <p className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <Info className="h-3 w-3" />
            {field.note}
          </p>
        )}
      </div>
    );
  }

  if (field.field_type === 'select') {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {field.field_number && (
            <span className="text-xs font-bold uppercase tracking-wide text-blue-500">
              {field.field_number}
            </span>
          )}
          <span>{fieldLabel}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <select
          {...register(field.field_name, {
            required: field.required ? 'Please make a selection' : false
          })}
          className={baseClasses}
        >
          <option value="">Select an option</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error.message}</p>}
        {field.note && (
          <p className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <Info className="h-3 w-3" />
            {field.note}
          </p>
        )}
      </div>
    );
  }

  if (field.field_type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {field.field_number && (
            <span className="text-xs font-bold uppercase tracking-wide text-blue-500">
              {field.field_number}
            </span>
          )}
          <span>{fieldLabel}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          {...register(field.field_name, {
            required: field.required ? 'This field is required' : false
          })}
          rows={field.rows || 4}
          className={baseClasses}
          placeholder={field.field_label}
        />
        {error && <p className="text-sm text-red-500">{error.message}</p>}
        {field.note && (
          <p className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <Info className="h-3 w-3" />
            {field.note}
          </p>
        )}
      </div>
    );
  }

  const inputType = field.field_type === 'email' ? 'email' : field.field_type === 'date' ? 'date' : 'text';

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {field.field_number && (
          <span className="text-xs font-bold uppercase tracking-wide text-blue-500">
            {field.field_number}
          </span>
        )}
        <span>{fieldLabel}</span>
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={inputType}
        {...register(field.field_name, {
          required: field.required ? 'This field is required' : false,
          ...(field.field_type === 'email'
            ? {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email'
                }
              }
            : {})
        })}
        className={baseClasses}
        placeholder={field.field_label}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {field.note && (
        <p className="flex items-center gap-2 text-xs font-medium text-blue-600">
          <Info className="h-3 w-3" />
          {field.note}
        </p>
      )}
    </div>
  );
};

const DynamicFormRenderer = ({ formData, onSubmit, onClose }) => {
  const [submissionState, setSubmissionState] = useState({ status: 'idle', message: '' });

  const defaultValues = useMemo(() => buildDefaultValues(formData), [formData]);
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
    setSubmissionState({ status: 'idle', message: '' });
  }, [defaultValues, reset]);

  const letterStructure = useMemo(() => parseLetterStructure(formData), [formData]);
  const {
    headerFields,
    contentTextBlocks,
    contentFields,
    contentGroups,
    mannerOptions,
    designatedOfficerFields,
    contactSections,
    closingFields
  } = letterStructure;

  const sections = formData?.sections || [];

  const renderTemplateField = (name, field, error) => {
    const fieldType = field.field_type || 'text';
    const inputClasses =
      'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';

    if (fieldType === 'textarea') {
      return (
        <div className="space-y-2" key={name}>
          <label className="text-sm font-semibold text-slate-700">
            {field.field_label}
          </label>
          <textarea
            {...register(name)}
            rows={field.rows || 4}
            className={inputClasses}
            placeholder={field.field_label}
          />
          {field.note && (
            <p className="text-xs text-blue-600">
              {field.note}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>
      );
    }

    let inputType = 'text';
    if (fieldType === 'date') {
      inputType = 'date';
    } else if (fieldType === 'number') {
      inputType = 'number';
    } else if (fieldType === 'email') {
      inputType = 'email';
    }

    return (
      <div className="space-y-2" key={name}>
        <label className="text-sm font-semibold text-slate-700">
          {field.field_label}
        </label>
        <input
          type={inputType}
          {...register(name)}
          className={inputClasses}
          placeholder={field.field_label}
        />
        {field.note && (
          <p className="text-xs text-blue-600">
            {field.note}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}
      </div>
    );
  };

  const handleFormSubmit = async (values) => {
    try {
      setSubmissionState({ status: 'submitting', message: '' });
      const payload = transformSubmission(values, formData);
      const result = await onSubmit(payload);

      if (result === false) {
        throw new Error('Submission was rejected');
      }

      setSubmissionState({
        status: 'success',
        message: 'Form submitted successfully. Our officers will contact you soon.'
      });
      toast.success(`RTI request ${formData?.form_id ?? ''} submitted successfully.`);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting RTI form:', error);
      setSubmissionState({
        status: 'error',
        message:
          'We could not submit the form right now. Please review the details and try again.'
      });
      toast.error('Failed to submit the RTI form. Please try again.');
    }
  };

  if (!formData) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <Toaster position="top-right" />
        <motion.div
          initial={{ scale: 0.96, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border-4 border-blue-100"
        >
          <div className="relative border-b-4 border-blue-100 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-8 py-6 text-white shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-xs font-bold uppercase tracking-wider border border-white/30 mb-3">
                  <FileText className="h-4 w-4" />
                  RTI Application Form
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">
                  {formData.form_title || formData.form_name}
                </h2>
                <p className="text-base text-blue-50 font-medium">
                  {formData.organization}
                  {formData.recipient ? ` • ${formData.recipient}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="self-start rounded-full p-3 bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                aria-label="Close form"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {formData.note && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 p-4 text-sm text-white font-medium">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="leading-relaxed">{formData.note}</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-8 md:px-10">
              <div className="max-w-4xl mx-auto space-y-8">
                {submissionState.status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-2 border-green-300 bg-green-50 p-6 text-green-800 shadow-lg flex items-center gap-4"
                  >
                    <Check className="h-8 w-8 flex-shrink-0 text-green-600" />
                    <p className="font-bold text-lg">{submissionState.message}</p>
                  </motion.div>
                )}
                {submissionState.status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-2 border-red-300 bg-red-50 p-6 text-red-800 shadow-lg flex items-center gap-4"
                  >
                    <X className="h-8 w-8 flex-shrink-0 text-red-600" />
                    <p className="font-bold text-lg">{submissionState.message}</p>
                  </motion.div>
                )}

                {formData.description && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Info className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Form Overview
                      </h3>
                    </div>
                    <p className="text-base leading-relaxed text-slate-700">
                      {formData.description}
                    </p>
                  </div>
                )}

                {formData.fields && formData.fields.length > 0 && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.User className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Applicant Information
                      </h3>
                    </div>
                    <div className="grid gap-6">
                      {formData.fields.map((field) => (
                        <FieldRenderer
                          key={field.field_name}
                          field={field}
                          register={register}
                          errors={errors}
                          control={control}
                          watch={watch}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {headerFields.length > 0 && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Letter Header
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {headerFields.map((field) =>
                        renderTemplateField(
                          `header.${field.field_name}`,
                          field,
                          errors?.header?.[field.field_name]
                        )
                      )}
                    </div>
                  </div>
                )}

                {(contentTextBlocks.length > 0 ||
                  contentFields.length > 0 ||
                  contentGroups.length > 0 ||
                  mannerOptions) && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <ListChecks className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Decision Details
                      </h3>
                    </div>

                    {contentTextBlocks.length > 0 && (
                      <div className="space-y-3">
                        {contentTextBlocks.map((text, index) => (
                          <p
                            key={`${text}-${index}`}
                            className="text-sm leading-relaxed text-slate-600"
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                    )}

                    {mannerOptions && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                          {mannerOptions.label}
                        </label>
                        <CheckboxGroupField
                          field={{
                            field_name: `content.${mannerOptions.name}`,
                            field_label: mannerOptions.label,
                            options: mannerOptions.options
                          }}
                          control={control}
                        />
                      </div>
                    )}

                    {contentFields.length > 0 && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {contentFields.map((field) =>
                          renderTemplateField(
                            `content.${field.field_name}`,
                            field,
                            errors?.content?.[field.field_name]
                          )
                        )}
                      </div>
                    )}

                    {contentGroups.length > 0 && (
                      <div className="space-y-4">
                        {contentGroups.map((group) => (
                          <div
                            key={group.key}
                            className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5"
                          >
                            <h4 className="text-lg font-semibold text-blue-800">
                              {group.title}
                            </h4>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {group.fields.map((field) =>
                                renderTemplateField(
                                  `content.${field.field_name}`,
                                  field,
                                  errors?.content?.[field.field_name]
                                )
                              )}
                            </div>
                            {group.note && (
                              <p className="mt-3 text-xs text-blue-600">
                                {group.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {designatedOfficerFields.length > 0 && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Designated Officer Details
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {designatedOfficerFields.map((field) =>
                        renderTemplateField(
                          `designated_officer.${field.field_name}`,
                          field,
                          errors?.designated_officer?.[field.field_name]
                        )
                      )}
                    </div>
                  </div>
                )}

                {contactSections.length > 0 && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.PhoneCall className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Contact Information
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {contactSections.map((section) => (
                        <div
                          key={section.sectionKey}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <h4 className="mb-4 text-lg font-semibold text-slate-800">
                            {section.title}
                          </h4>
                          <div className="space-y-4">
                            {section.fields.map((field) =>
                              renderTemplateField(
                                `contact_info.${section.sectionKey}.${field.field_name}`,
                                field,
                                errors?.contact_info?.[section.sectionKey]?.[field.field_name]
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {closingFields.length > 0 && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.Edit3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Letter Closing Details
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {closingFields.map((field) =>
                        renderTemplateField(
                          `closing.${field.field_name}`,
                          field,
                          errors?.closing?.[field.field_name]
                        )
                      )}
                    </div>
                  </div>
                )}

                {formData.table_columns && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.Table className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {formData.tableTitle || 'Record Entries'}
                      </h3>
                    </div>
                    <TableBuilder
                      columns={formData.table_columns}
                      control={control}
                      register={register}
                      errors={errors}
                    />
                  </div>
                )}

                {sections.length > 0 && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Officer & Administrative Details
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {sections.map((section) => (
                        <SectionBlock
                          key={section.section_name}
                          section={section}
                          control={control}
                          register={register}
                          errors={errors}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {formData.signature_section && (
                  <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-green-200">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Icons.PenTool className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Sign & Confirm
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {Object.entries(formData.signature_section).map(
                        ([key, label]) => (
                          <div key={key} className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                              {label}
                            </label>
                            <input
                              type={label.toLowerCase().includes('date') ? 'date' : 'text'}
                              {...register(`signature.${normalizeKey(label) || key}`, {
                                required: true
                              })}
                              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {formData.footer && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icons.Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Publication Details
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      {Object.entries(formData.footer).map(([key, label]) => (
                        <div key={key} className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">
                            {label}
                          </label>
                          <input
                            type={
                              label.toLowerCase().includes('date')
                                ? 'date'
                                : 'text'
                            }
                            {...register(`footer.${key}`)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-4 border-blue-100 bg-white px-8 py-6 shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      Important Notice
                    </p>
                    <p className="text-xs text-slate-600">
                      By submitting this form you certify that the information provided is accurate to the best of your knowledge.
                      {!isDirty && (
                        <span className="block mt-1 text-slate-500">
                          All fields marked with <span className="text-red-600 font-bold">*</span> are required.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 shadow-sm"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || submissionState.status === 'success'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-xl transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-500 hover:shadow-2xl hover:scale-105"
                  >
                    <Send className="h-5 w-5" />
                    {isSubmitting ? 'Submitting...' : 'Submit RTI Request'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicFormRenderer;
