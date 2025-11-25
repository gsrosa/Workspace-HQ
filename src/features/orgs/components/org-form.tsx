'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrgSchema, type CreateOrgInput } from '../shared/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateOrg } from '../hooks/use-org';
import { useSelectedOrg } from '../hooks/use-selected-org';

interface OrgFormProps {
  onSuccess?: () => void;
}

export const OrgForm = ({ onSuccess }: OrgFormProps) => {
  const router = useRouter();
  const createOrg = useCreateOrg();
  const { setSelectedOrg } = useSelectedOrg();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<CreateOrgInput>({
    resolver: zodResolver(createOrgSchema),
  });

  const onSubmit = async (data: CreateOrgInput) => {
    try {
      const org = await createOrg.mutateAsync(data);
      reset();
      await setSelectedOrg(org.id);
      if (onSuccess) {
        onSuccess();
      }
      router.push(`/orgs/${org.id}/tasks`);
      router.refresh();
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to create organization',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <Input
        {...register('name')}
        label="Organization Name"
        type="text"
        placeholder="Acme Inc."
        error={errors.name?.message}
        autoComplete="organization"
      />
      {errors.root && (
        <p className="text-sm text-danger-500" role="alert">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Organization'}
      </Button>
    </form>
  );
};

