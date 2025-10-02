# Custom Form Components Documentation

This document provides usage examples for the custom form components created for the SwagBox Vendor app.

## Components Overview

### 1. FormInput

Enhanced input component with consistent styling and Rubik fonts.

```tsx
import { FormInput } from "../components/ui";

<FormInput
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
  rightIcon={<Ionicons name="checkmark" size={20} color="#10B981" />}
  onRightIconPress={() => console.log("Right icon pressed")}
  error="Please enter a valid email"
  helperText="We'll never share your email"
  required
  variant="default" // "default" | "outline" | "filled"
  size="md" // "sm" | "md" | "lg"
/>;
```

### 2. FormButton

Consistent button component with loading states and icons.

```tsx
import { FormButton } from "../components/ui";

<FormButton
  title="Sign In"
  onPress={handleLogin}
  variant="primary" // "primary" | "secondary" | "outline" | "danger" | "ghost"
  size="lg" // "sm" | "md" | "lg" | "xl"
  loading={isLoading}
  leftIcon="log-in"
  rightIcon="chevron-forward"
  fullWidth={true}
/>;
```

### 3. FormTextArea

Multi-line text input with character counting.

```tsx
import { FormTextArea } from "../components/ui";

<FormTextArea
  label="Business Description"
  placeholder="Describe your business..."
  value={description}
  onChangeText={setDescription}
  rows={4}
  maxLength={500}
  showCharCount={true}
  error="Description is too short"
  helperText="Tell customers about your business"
  required
/>;
```

### 4. FormSelect

Dropdown select with search functionality.

```tsx
import { FormSelect } from "../components/ui";

const options = [
  { label: "Fashion & Clothing", value: "fashion" },
  { label: "Electronics", value: "electronics" },
  { label: "Home & Garden", value: "home" },
];

<FormSelect
  label="Business Category"
  placeholder="Select a category"
  options={options}
  value={selectedCategory}
  onValueChange={setSelectedCategory}
  error="Please select a category"
  required
  searchable={true}
/>;
```

### 5. FormCheckbox

Checkbox component with consistent styling.

```tsx
import { FormCheckbox } from "../components/ui";

<FormCheckbox
  label="I agree to the Terms and Conditions"
  checked={agreed}
  onValueChange={setAgreed}
  error="You must agree to continue"
  helperText="Read our terms and privacy policy"
  variant="primary" // "default" | "primary" | "success" | "danger"
  size="md" // "sm" | "md" | "lg"
/>;
```

## Design System

### Colors

- **Primary**: Blue (#2563EB)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Gray Scale**: Various shades for text and borders

### Typography (Rubik Font)

- **font-rubik-regular**: Body text, descriptions
- **font-rubik-medium**: Labels, buttons
- **font-rubik-semibold**: Section headers
- **font-rubik-bold**: Main headers

### Sizes

- **sm**: Small components for compact layouts
- **md**: Default size for most use cases
- **lg**: Larger components for emphasis
- **xl**: Extra large for hero sections

### Variants

- **default**: Standard styling with borders
- **outline**: Transparent background with borders
- **filled**: Solid background, no borders
- **primary/secondary/danger**: Color variants

## Usage in Forms

### Complete Form Example

```tsx
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  FormInput,
  FormButton,
  FormSelect,
  FormTextArea,
  FormCheckbox,
} from "../components/ui";

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <ScrollView className="flex-1 p-6">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Full Name"
            placeholder="Enter your name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <FormSelect
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            value={value}
            onValueChange={onChange}
            error={errors.category?.message}
            required
          />
        )}
      />

      <FormButton
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        variant="primary"
        size="lg"
      />
    </ScrollView>
  );
};
```

## Accessibility Features

- Proper label associations
- Screen reader support
- Keyboard navigation
- Focus management
- Error announcements

## Customization

All components accept a `className` prop for additional Tailwind CSS styling:

```tsx
<FormInput
  className="mb-6 shadow-lg"
  // ... other props
/>
```

## Best Practices

1. **Consistent Sizing**: Use the same size across related form elements
2. **Error Handling**: Always provide clear error messages
3. **Helper Text**: Use helper text to guide users
4. **Required Fields**: Mark required fields clearly
5. **Loading States**: Show loading states for async operations
6. **Accessibility**: Ensure all components are accessible

## Migration from Old Components

### Old Button → FormButton

```tsx
// Old
<Button title="Submit" onPress={handleSubmit} />

// New
<FormButton title="Submit" onPress={handleSubmit} variant="primary" />
```

### Old Input → FormInput

```tsx
// Old
<Input label="Email" value={email} onChangeText={setEmail} />

// New
<FormInput label="Email" value={email} onChangeText={setEmail} required />
```
