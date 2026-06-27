import React, { useEffect, useMemo, useState } from 'react';
import { useController, useFieldArray, useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100';

const toTitleCase = (value = '') =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1));

const normalizeKey = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const getNestedError = (errors, path) =>
  path.split('.').reduce((current, key) => current?.[key], errors);

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
  if (field.subfield_label) return field.subfield_label;
  if (field.column_label) return field.column_label;
  if (field.description) return field.description;
  if (field.instruction) return field.instruction.replace(/\[.*?\]/g, '').trim();
  if (field.title) return field.title;
  return toTitleCase(field.field_name || field.subfield_name || fallbackKey);
};

const parseLetterStructure = (formData = {}) => {
  const headerFields = (formData.header_fields || []).map((field) => ({
    ...field,
    field_label: field.field_label || toTitleCase(field.field_name),
    field_type: field.field_type || 'text'
  }));

  const contentTextBlocks = [];
  const contentFields = [];
  const contentGroups = [];
  let mannerOptions = null;

  Object.entries(formData.content || {}).forEach(([key, value]) => {
    if (key === 'manner_options' && Array.isArray(value)) {
      mannerOptions = {
        name: 'manner_options',
        label: 'Manner in which information is provided',
        options: value
      };
      return;
    }

    if (key === 'reasons_section' && value) {
      contentGroups.push({
        key,
        title: value.title || toTitleCase(key),
        note: value.note,
        fields: (value.reason_fields || []).map((reason) => ({
          field_name: reason.field_name,
          field_label: reason.reason_number
            ? `Reason ${reason.reason_number}`
            : deriveFieldLabel(reason, reason.field_name),
          field_type: reason.field_type || 'textarea',
          rows: reason.rows || 4
        }))
      });
      return;
    }

    if (key === 'extension_details' && value) {
      const fields = Object.values(value)
        .filter((item) => item?.field_name)
        .map((item) => ({
          field_name: item.field_name,
          field_label: item.field_label || deriveFieldLabel(item, item.field_name),
          field_type: item.field_type || 'text'
        }));

      if (fields.length > 0) {
        contentGroups.push({ key, title: 'Extension Details', fields });
      }
      return;
    }

    if (key === 'payment_instruction' && value?.field_name) {
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
        field_name: key,
        field_label: label,
        field_type: key.includes('address') || key.includes('contact') ? 'textarea' : 'text'
      }))
    : [];

  const contactSections = [];
  if (formData.contact_info) {
    Object.entries(formData.contact_info).forEach(([sectionKey, info]) => {
      contactSections.push({
        sectionKey,
        title: toTitleCase(sectionKey),
        fields: Object.entries(info).map(([key, label]) => ({
          field_name: key,
          field_label: label,
          field_type: key.includes('address') || key.includes('contact') ? 'textarea' : 'text'
        }))
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

const buildDefaultValues = (formData = {}) => {
  const defaults = {};
  const letterStructure = parseLetterStructure(formData);

  (formData.fields || []).forEach((field) => {
    if (field.field_type === 'checkbox' || field.field_type === 'list') {
      defaults[field.field_name] = [];
    } else if (field.field_type === 'group') {
      defaults[field.field_name] = {};
      field.subfields?.forEach((subfield) => {
        defaults[field.field_name][subfield.subfield_name] = '';
      });
    } else {
      defaults[field.field_name] = '';
    }

    if (field.conditional?.if_yes) {
      defaults[field.conditional.if_yes.field_name] = '';
    }
  });

  if (formData.table_columns) {
    defaults.tableRows = [createTableRowDefaults(formData.table_columns)];
  }

  (formData.sections || []).forEach((section) => {
    defaults[normalizeKey(section.section_name)] = [createSectionEntryDefaults(section)];
  });

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
    defaults.content = {};
    letterStructure.contentFields.forEach((field) => {
      defaults.content[field.field_name] = '';
    });
    letterStructure.contentGroups.forEach((group) => {
      group.fields.forEach((field) => {
        defaults.content[field.field_name] = '';
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

  if (formData.signature_section) {
    defaults.signature = {};
    Object.entries(formData.signature_section).forEach(([key, label]) => {
      defaults.signature[normalizeKey(label) || key] = '';
    });
  }

  if (formData.footer) {
    defaults.footer = Object.keys(formData.footer).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
  }

  return defaults;
};

const transformSubmission = (values, formData = {}) => {
  const submission = {
    formId: formData.form_id,
    formName: formData.form_name,
    formTitle: formData.form_title,
    submittedAt: new Date().toISOString()
  };

  const fieldsPayload = {};
  (formData.fields || []).forEach((field) => {
    fieldsPayload[field.field_name] = values[field.field_name] ?? (field.field_type === 'checkbox' || field.field_type === 'list' ? [] : '');

    if (field.conditional?.if_yes) {
      fieldsPayload[field.conditional.if_yes.field_name] =
        values[field.conditional.if_yes.field_name] ?? '';
    }
  });

  if (Object.keys(fieldsPayload).length > 0) submission.fields = fieldsPayload;
  if (Array.isArray(values.tableRows)) submission.tableRows = values.tableRows;

  if (formData.sections) {
    const sectionsPayload = {};
    formData.sections.forEach((section) => {
      const key = normalizeKey(section.section_name);
      if (values[key]) sectionsPayload[section.section_name] = values[key];
    });
    if (Object.keys(sectionsPayload).length > 0) submission.sections = sectionsPayload;
  }

  if (values.signature) submission.signature = values.signature;
  if (values.footer) submission.footer = values.footer;
  if (values.header) submission.header = values.header;
  if (values.content) submission.content = values.content;
  if (values.designated_officer) submission.designatedOfficer = values.designated_officer;
  if (values.contact_info) submission.contactInfo = values.contact_info;
  if (values.closing) submission.closing = values.closing;

  return submission;
};

const createPrimaryFieldSteps = (formData = {}) => {
  const fields = formData.fields || [];
  if (!fields.length) return [];

  const buckets = [
    {
      id: 'field-applicant',
      title: 'Applicant',
      description: 'Who is making this request',
      icon: Icons.User,
      fields: []
    },
    {
      id: 'field-request',
      title: 'Information Requested',
      description: 'Tell NARA exactly what information is needed',
      icon: Icons.Search,
      fields: []
    },
    {
      id: 'field-access',
      title: 'Access & Documents',
      description: 'Language, delivery method, urgency, and attachments',
      icon: Icons.FolderOpen,
      fields: []
    },
    {
      id: 'field-office',
      title: 'Office Details',
      description: 'References, officer notes, due dates, and fees',
      icon: Icons.ClipboardList,
      fields: []
    }
  ];

  const addToBucket = (bucketIndex, field) => {
    buckets[bucketIndex].fields.push(field);
  };

  fields.forEach((field) => {
    const text = normalizeKey(`${field.field_name || ''} ${deriveFieldLabel(field)}`);

    if (
      /manner|language|mode|preferred|documents|attachments|attached|life_liberty|liberty|other_details|remarks/.test(text)
    ) {
      addToBucket(2, field);
      return;
    }

    if (
      /name|address|contact|email|requestor|appellant|citizen|representative/.test(text) &&
      !/authority|officer|decision|requested|information/.test(text)
    ) {
      addToBucket(0, field);
      return;
    }

    if (
      /information_requested|summary|grounds|appeal|public_authority|original_request|decision_requested|request_details|period|concerned/.test(text)
    ) {
      addToBucket(1, field);
      return;
    }

    addToBucket(3, field);
  });

  const populated = buckets.filter((bucket) => bucket.fields.length > 0);

  if (populated.length <= 1) {
    return [
      {
        id: 'field-applicant',
        title: 'Application Details',
        description: 'Complete the details requested in this RTI form',
        icon: Icons.FileText,
        fields,
        showIntro: true,
        type: 'fields'
      }
    ];
  }

  return populated.map((bucket, index) => ({
    ...bucket,
    showIntro: index === 0,
    type: 'fields'
  }));
};

const FieldShell = ({ children, error, hint, label, required }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>{label}</span>
      {required && <span className="text-red-600">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs leading-5 text-slate-500">{hint}</p>}
    {error && <p className="text-sm font-medium text-red-600">{error.message || String(error)}</p>}
  </div>
);

const CheckboxGroupField = ({ control, name, options = [], required }) => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    defaultValue: [],
    rules: required
      ? {
          validate: (value) =>
            Array.isArray(value) && value.length > 0
              ? true
              : 'Please select at least one option'
        }
      : undefined
  });

  const selected = Array.isArray(field.value) ? field.value : [];

  const toggleOption = (option) => {
    field.onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                checked
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span>{option}</span>
              {checked && <Icons.Check className="h-4 w-4 flex-shrink-0 text-blue-600" />}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error.message}</p>}
    </div>
  );
};

const ListInputField = ({ control, field, name }) => {
  const [inputValue, setInputValue] = useState('');
  const {
    field: controller,
    fieldState: { error }
  } = useController({
    name,
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

  const items = Array.isArray(controller.value) ? controller.value : [];
  const maxItems = field.max_items || 8;
  const limitReached = items.length >= maxItems;

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || limitReached) return;
    controller.onChange([...items, trimmed]);
    setInputValue('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder="Type an item, then press Add"
          className={FIELD_CLASS}
          disabled={limitReached}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={limitReached}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Icons.Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-800"
            >
              {item}
              <button
                type="button"
                onClick={() => controller.onChange(items.filter((_, idx) => idx !== index))}
                className="rounded-full p-1 text-blue-600 hover:bg-blue-100"
                aria-label={`Remove ${item}`}
              >
                <Icons.X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-600">{error.message}</p>}
    </div>
  );
};

const BasicField = ({ control, errors, field, name, register, watch }) => {
  const label = deriveFieldLabel(field, name);
  const error = getNestedError(errors, name);
  const fieldType = field.field_type || field.data_type || 'text';

  if (fieldType === 'group') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
            <Icons.ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{label}</h3>
            {field.description && <p className="mt-1 text-sm text-slate-600">{field.description}</p>}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {(field.subfields || []).map((subfield) => (
            <BasicField
              key={subfield.subfield_name}
              control={control}
              errors={errors}
              field={{
                ...subfield,
                field_name: subfield.subfield_name,
                field_label: subfield.subfield_label
              }}
              name={`${name}.${subfield.subfield_name}`}
              register={register}
              watch={watch}
            />
          ))}
        </div>
      </div>
    );
  }

  if (fieldType === 'checkbox') {
    return (
      <FieldShell error={error} hint={field.note} label={label} required={field.required}>
        <CheckboxGroupField
          control={control}
          name={name}
          options={field.options || []}
          required={field.required}
        />
      </FieldShell>
    );
  }

  if (fieldType === 'list') {
    return (
      <FieldShell error={error} hint={field.note} label={label} required={field.required}>
        <ListInputField control={control} field={field} name={name} />
      </FieldShell>
    );
  }

  if (fieldType === 'radio') {
    const selectedValue = watch(name);
    return (
      <FieldShell error={error} hint={field.note} label={label} required={field.required}>
        <div className="grid gap-3 sm:grid-cols-2">
          {(field.options || []).map((option) => (
            <label
              key={option}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                selectedValue === option
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <input
                type="radio"
                value={option}
                {...register(name, {
                  required: field.required ? 'Please make a selection' : false
                })}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {field.conditional?.if_yes && selectedValue === 'Yes' && (
          <div className="mt-4">
            <BasicField
              control={control}
              errors={errors}
              field={field.conditional.if_yes}
              name={field.conditional.if_yes.field_name}
              register={register}
              watch={watch}
            />
          </div>
        )}
      </FieldShell>
    );
  }

  if (fieldType === 'select') {
    return (
      <FieldShell error={error} hint={field.note} label={label} required={field.required}>
        <select
          {...register(name, {
            required: field.required ? 'Please select an option' : false
          })}
          className={FIELD_CLASS}
        >
          <option value="">Select an option</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (fieldType === 'textarea') {
    return (
      <FieldShell error={error} hint={field.note} label={label} required={field.required}>
        <textarea
          {...register(name, {
            required: field.required ? 'This field is required' : false
          })}
          rows={field.rows || 5}
          placeholder={label}
          className={`${FIELD_CLASS} min-h-32 resize-y`}
        />
      </FieldShell>
    );
  }

  const inputType =
    fieldType === 'email' ? 'email' : fieldType === 'date' ? 'date' : fieldType === 'number' || fieldType === 'currency' ? 'number' : 'text';

  return (
    <FieldShell error={error} hint={field.note} label={label} required={field.required}>
      <input
        type={inputType}
        step={fieldType === 'currency' ? '0.01' : undefined}
        {...register(name, {
          required: field.required ? 'This field is required' : false,
          ...(fieldType === 'email'
            ? {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              }
            : {})
        })}
        placeholder={label}
        className={FIELD_CLASS}
      />
    </FieldShell>
  );
};

const TableBuilder = ({ columns = [], control, errors, register }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'tableRows' });

  return (
    <div className="space-y-5">
      {fields.map((row, rowIndex) => (
        <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">Entry {rowIndex + 1}</h3>
            <button
              type="button"
              onClick={() => remove(rowIndex)}
              disabled={fields.length === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icons.Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {columns.map((column) => (
              <BasicField
                key={column.column_name}
                control={control}
                errors={errors}
                field={{
                  field_name: column.column_name,
                  field_label: column.column_label,
                  field_type: column.data_type === 'currency' ? 'currency' : column.data_type || 'text',
                  required: column.required
                }}
                name={`tableRows.${rowIndex}.${column.column_name}`}
                register={register}
                watch={() => undefined}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append(createTableRowDefaults(columns))}
        className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
      >
        <Icons.Plus className="h-4 w-4" />
        Add another entry
      </button>
    </div>
  );
};

const SectionBlock = ({ control, errors, register, section }) => {
  const sectionKey = normalizeKey(section.section_name);
  const { fields, append, remove } = useFieldArray({ control, name: sectionKey });

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{section.section_name}</h3>
          {section.repeatable && <p className="text-sm text-slate-500">Add more entries when needed.</p>}
        </div>
        {section.repeatable && (
          <button
            type="button"
            onClick={() => append(createSectionEntryDefaults(section))}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            <Icons.Plus className="h-4 w-4" />
            Add entry
          </button>
        )}
      </div>

      <div className="space-y-5">
        {fields.map((fieldGroup, groupIndex) => (
          <div key={fieldGroup.id} className="rounded-xl bg-white p-4">
            {section.repeatable && fields.length > 1 && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Entry {groupIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(groupIndex)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Icons.Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {(section.fields || []).map((field) => (
                <BasicField
                  key={field.field_name}
                  control={control}
                  errors={errors}
                  field={field}
                  name={`${sectionKey}.${groupIndex}.${field.field_name}`}
                  register={register}
                  watch={() => undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DynamicFormRenderer = ({ formData, onSubmit, onClose }) => {
  const [submissionState, setSubmissionState] = useState({ status: 'idle', message: '' });
  const [activeStep, setActiveStep] = useState(0);

  const defaultValues = useMemo(() => buildDefaultValues(formData), [formData]);
  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch
  } = useForm({
    defaultValues,
    shouldUnregister: false
  });

  const letterStructure = useMemo(() => parseLetterStructure(formData), [formData]);
  const {
    closingFields,
    contactSections,
    contentFields,
    contentGroups,
    contentTextBlocks,
    designatedOfficerFields,
    headerFields,
    mannerOptions
  } = letterStructure;
  const sections = formData?.sections || [];
  const primaryFieldSteps = useMemo(() => createPrimaryFieldSteps(formData), [formData]);

  useEffect(() => {
    reset(defaultValues);
    setActiveStep(0);
    setSubmissionState({ status: 'idle', message: '' });
  }, [defaultValues, reset]);

  const steps = useMemo(() => {
    const list = [];
    list.push(...primaryFieldSteps);
    if (headerFields.length > 0) {
      list.push({ id: 'header', title: 'Request Details', description: 'Reference and authority details', icon: Icons.FileText });
    }
    if (contentTextBlocks.length || contentFields.length || contentGroups.length || mannerOptions) {
      list.push({ id: 'content', title: 'Decision Details', description: 'Decision, reason, or delivery details', icon: Icons.ClipboardList });
    }
    if (formData?.table_columns) {
      list.push({ id: 'table', title: 'Register Entries', description: 'Register rows', icon: Icons.Table });
    }
    if (sections.length > 0) {
      list.push({ id: 'sections', title: 'Administration', description: 'Officer or internal details', icon: Icons.Briefcase });
    }
    if (designatedOfficerFields.length || contactSections.length || closingFields.length) {
      list.push({ id: 'contact', title: 'Contact', description: 'Officer contact and closing details', icon: Icons.PhoneCall });
    }
    if (formData?.signature_section || formData?.footer) {
      list.push({ id: 'confirmation', title: 'Confirmation', description: 'Signature, dates, and final notes', icon: Icons.PenTool });
    }
    list.push({ id: 'review', title: 'Review', description: 'Submit to the RTI desk', icon: Icons.CheckCircle });
    return list;
  }, [
    closingFields.length,
    contactSections.length,
    contentFields.length,
    contentGroups.length,
    contentTextBlocks.length,
    designatedOfficerFields.length,
    formData,
    headerFields.length,
    mannerOptions,
    primaryFieldSteps,
    sections.length
  ]);

  const currentStep = steps[activeStep] || steps[0];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const progress = steps.length > 1 ? Math.round(((activeStep + 1) / steps.length) * 100) : 100;

  const renderTemplateField = (name, field) => (
    <BasicField
      key={name}
      control={control}
      errors={errors}
      field={field}
      name={name}
      register={register}
      watch={watch}
    />
  );

  const renderPrimaryFields = (step) => (
    <div className="space-y-6">
      {step.showIntro && (formData.description || formData.note) && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          {formData.description && <p>{formData.description}</p>}
          {formData.note && <p className="mt-3 font-medium text-blue-800">{formData.note}</p>}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {(step.fields || []).map((field) => {
          const wide = ['group', 'checkbox', 'list', 'textarea'].includes(field.field_type);
          return (
            <div key={field.field_name} className={wide ? 'md:col-span-2' : ''}>
              <BasicField
                control={control}
                errors={errors}
                field={field}
                name={field.field_name}
                register={register}
                watch={watch}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  const handleFormSubmit = async (values) => {
    if (!isLastStep) {
      setActiveStep((step) => Math.min(step + 1, steps.length - 1));
      return;
    }

    try {
      setSubmissionState({ status: 'submitting', message: '' });
      const result = await onSubmit(transformSubmission(values, formData));

      if (result === false || result?.error) {
        throw new Error(result?.error || 'Submission was rejected');
      }

      const referenceId = result?.data?.referenceId || result?.referenceId || '';
      setSubmissionState({
        status: 'success',
        referenceId,
        message: referenceId
          ? `Form submitted successfully. Reference number: ${referenceId}`
          : 'Form submitted successfully. Our officers will contact you soon.'
      });
      toast.success(referenceId ? `RTI request saved: ${referenceId}` : 'RTI request submitted successfully.');
    } catch (error) {
      console.error('Error submitting RTI form:', error);
      setSubmissionState({
        status: 'error',
        message: 'We could not submit the form right now. Please review the details and try again.'
      });
      toast.error('Failed to submit the RTI form. Please try again.');
    }
  };

  const renderCurrentStep = () => {
    if (currentStep?.type === 'fields') {
      return renderPrimaryFields(currentStep);
    }

    switch (currentStep?.id) {
      case 'header':
        return <div className="grid gap-5 md:grid-cols-2">{headerFields.map((field) => renderTemplateField(`header.${field.field_name}`, field))}</div>;
      case 'content':
        return (
          <div className="space-y-6">
            {contentTextBlocks.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                {contentTextBlocks.map((text, index) => <p key={`${text}-${index}`}>{text}</p>)}
              </div>
            )}
            {mannerOptions && (
              <FieldShell label={mannerOptions.label}>
                <CheckboxGroupField control={control} name={`content.${mannerOptions.name}`} options={mannerOptions.options} />
              </FieldShell>
            )}
            {contentFields.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">{contentFields.map((field) => renderTemplateField(`content.${field.field_name}`, field))}</div>
            )}
            {contentGroups.map((group) => (
              <div key={group.key} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <h3 className="font-semibold text-slate-900">{group.title}</h3>
                  {group.note && <p className="mt-1 text-sm text-blue-700">{group.note}</p>}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {group.fields.map((field) => renderTemplateField(`content.${field.field_name}`, field))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'table':
        return <TableBuilder columns={formData.table_columns} control={control} errors={errors} register={register} />;
      case 'sections':
        return <div className="space-y-5">{sections.map((section) => <SectionBlock key={section.section_name} control={control} errors={errors} register={register} section={section} />)}</div>;
      case 'contact':
        return (
          <div className="space-y-6">
            {designatedOfficerFields.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">{designatedOfficerFields.map((field) => renderTemplateField(`designated_officer.${field.field_name}`, field))}</div>
            )}
            {contactSections.map((section) => (
              <div key={section.sectionKey} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{section.title}</h3>
                <div className="grid gap-5 md:grid-cols-2">
                  {section.fields.map((field) => renderTemplateField(`contact_info.${section.sectionKey}.${field.field_name}`, field))}
                </div>
              </div>
            ))}
            {closingFields.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">{closingFields.map((field) => renderTemplateField(`closing.${field.field_name}`, field))}</div>
            )}
          </div>
        );
      case 'confirmation':
        return (
          <div className="space-y-6">
            {formData.signature_section && (
              <div className="grid gap-5 md:grid-cols-2">
                {Object.entries(formData.signature_section).map(([key, label]) =>
                  renderTemplateField(`signature.${normalizeKey(label) || key}`, {
                    field_name: key,
                    field_label: label,
                    field_type: label.toLowerCase().includes('date') ? 'date' : 'text',
                    required: true
                  })
                )}
              </div>
            )}
            {formData.footer && (
              <div className="grid gap-5 md:grid-cols-3">
                {Object.entries(formData.footer).map(([key, label]) =>
                  renderTemplateField(`footer.${key}`, {
                    field_name: key,
                    field_label: label,
                    field_type: label.toLowerCase().includes('date') ? 'date' : 'text'
                  })
                )}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {submissionState.status === 'success' && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
                <div className="flex items-start gap-3">
                  <Icons.Check className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{submissionState.message}</p>
                    {submissionState.referenceId && <p className="mt-1 text-sm">Keep this number when contacting the RTI desk.</p>}
                  </div>
                </div>
              </div>
            )}
            {submissionState.status === 'error' && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                <div className="flex items-start gap-3">
                  <Icons.X className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="font-semibold">{submissionState.message}</p>
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Ready to submit</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the step buttons to review the form. When submitted, it will go to the NARA RTI admin inbox with a reference number.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Form</p>
                  <p className="mt-1 font-semibold text-slate-900">{formData.form_id || 'RTI'}</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Destination</p>
                  <p className="mt-1 font-semibold text-slate-900">NARA RTI Desk</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                  <p className="mt-1 font-semibold text-slate-900">New request</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
              By submitting this form you certify that the information provided is accurate to the best of your knowledge.
            </div>
          </div>
        );
    }
  };

  if (!formData) return null;

  const StepIcon = currentStep?.icon || Icons.FileText;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-slate-950/65 p-2 backdrop-blur-sm sm:p-4"
        onClick={onClose}
      >
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rti-form-title"
          className="mx-auto flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <Icons.FileText className="h-3.5 w-3.5" />
                  Online RTI Application
                </div>
                <h2 id="rti-form-title" className="mt-2 text-xl font-bold leading-tight text-slate-950 sm:text-2xl">
                  {formData.form_title || formData.form_name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {formData.organization || 'National Aquatic Resources Research and Development Agency'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                aria-label="Close form"
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && event.target?.tagName !== 'TEXTAREA' && !isLastStep) {
                event.preventDefault();
              }
            }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="grid min-h-0 w-full flex-1 grid-cols-[104px_minmax(0,1fr)] grid-rows-1 sm:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)]">
              <aside className="min-w-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-2 sm:p-4">
                <div className="space-y-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon || Icons.Circle;
                    const active = index === activeStep;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setActiveStep(index)}
                        className={`flex min-h-12 w-full items-center gap-2 rounded-xl px-2 py-3 text-left transition sm:gap-3 sm:px-3 ${
                          active
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-white text-slate-700 hover:bg-blue-50'
                        }`}
                      >
                        <span className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${active ? 'bg-white/15' : 'bg-slate-100 text-blue-700'}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold leading-tight sm:text-sm">{index + 1}. {step.title}</span>
                          <span className={`hidden truncate text-xs sm:block ${active ? 'text-blue-100' : 'text-slate-500'}`}>{step.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="min-h-0 min-w-0 overflow-y-auto bg-white">
                <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
                  <div className="mb-6 flex items-start gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <StepIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Step {activeStep + 1} of {steps.length}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-950">{currentStep.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{currentStep.description}</p>
                    </div>
                  </div>
                  {renderCurrentStep()}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                  {isDirty ? 'Your typed details are kept while moving between steps.' : 'Fields marked with * are required where applicable.'}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isFirstStep}
                    onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icons.ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep((step) => Math.min(step + 1, steps.length - 1))}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                      Next
                      <Icons.ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || submissionState.status === 'success'}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      <Icons.Send className="h-4 w-4" />
                      {isSubmitting ? 'Submitting...' : 'Submit RTI Request'}
                    </button>
                  )}
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
