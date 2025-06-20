'use client';

import { RECOGNITION_TYPES } from '@/constants';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/useToast';
import { Participant, RecognitionType } from '@/types';
import { memo, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ParticipantSelector } from './ParticipantSelector';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';

interface FormData {
  recipient: Participant | null;
  recognitionType: RecognitionType | null;
  message: string;
  image: File | null;
  hashtags: string[];
}

export const RecognitionForm = memo(function RecognitionForm() {
  const { state, actions } = useApp();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      recipient: null,
      recognitionType: null,
      message: '',
      image: null,
      hashtags: []
    }
  });

  const watchMessage = watch('message');
  const watchImage = watch('image');
  const watchHashtags = watch('hashtags');

  useEffect(() => {
    const hashtags = watchMessage?.match(/#\w+/g)?.map((tag: string) => tag.substring(1)) || [];
    setValue('hashtags', hashtags);
  }, [watchMessage, setValue]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        setError('image', { message: 'A imagem deve ter no máximo 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        setError('image', { message: 'Por favor, selecione apenas arquivos de imagem' });
        return;
      }
      
      setValue('image', file);
      clearErrors('image');
      toast.success('Imagem adicionada com sucesso!');
    }
  };

  const handleRemoveImage = () => {
    setValue('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Imagem removida');
  };

  const validateForm = (data: FormData): boolean => {
    let isValid = true;

    if (!data.recipient) {
      setError('recipient', { message: 'Por favor, selecione um participante' });
      isValid = false;
    }

    if (!data.recognitionType) {
      setError('recognitionType', { message: 'Por favor, selecione um tipo de reconhecimento' });
      isValid = false;
    }

    if (!data.message.trim()) {
      setError('message', { message: 'Por favor, escreva uma mensagem' });
      isValid = false;
    } else if (data.message.length > 500) {
      setError('message', { message: 'A mensagem deve ter no máximo 500 caracteres' });
      isValid = false;
    }

    if (!data.image) {
      setError('image', { message: 'Por favor, selecione uma imagem' });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateForm(data)) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const loadingToast = toast.loading('Publicando reconhecimento...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPostData = {
        recipient: data.recipient!,
        recognitionType: data.recognitionType!,
        message: data.message,
        image: data.image!,
        hashtags: data.hashtags
      };
      
      actions.addNewPost(newPostData);
      
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.dismiss(loadingToast);
      toast.success('Reconhecimento publicado com sucesso! 🎉');
      
    } catch (error) {
      console.error('Error submitting recognition:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao publicar reconhecimento. Tente novamente.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Criar novo reconhecimento</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="recipient"
          control={control}
          render={({ field }) => (
            <ParticipantSelector
              participants={state.participants}
              selectedParticipant={field.value}
              onSelect={(participant) => {
                field.onChange(participant);
                if (participant) clearErrors('recipient');
              }}
              error={errors.recipient?.message}
            />
          )}
        />

        <Controller
          name="recognitionType"
          control={control}
          render={({ field }) => (
            <Select
              label="Tipo de reconhecimento"
              placeholder="Selecione o tipo de reconhecimento"
              options={RECOGNITION_TYPES}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                if (value) clearErrors('recognitionType');
              }}
              error={errors.recognitionType?.message}
              required
            />
          )}
        />

        <div className="space-y-2">
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Mensagem *"
                placeholder="Escreva sua mensagem de reconhecimento... Use #hashtags para categorizar!"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (e.target.value.trim()) clearErrors('message');
                }}
                rows={4}
                error={errors.message?.message}
                className="cursor-text"
              />
            )}
          />
          <div className="flex items-center justify-between text-sm text-gray-500 px-1">
            <span>Use # para adicionar hashtags (ex: #excelente #trabalhoEmEquipe)</span>
            <span className={(watchMessage?.length || 0) > 450 ? 'text-red-500' : ''}>
              {watchMessage?.length || 0}/500
            </span>
          </div>
        </div>

        {watchHashtags && watchHashtags.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Hashtags detectadas:</label>
            <div className="flex flex-wrap gap-2">
              {watchHashtags.map((hashtag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Imagem *</label>
          
          {watchImage ? (
            <div className="relative">
              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(watchImage)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                onClick={handleRemoveImage}
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
              >
                Remover
              </Button>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`
                  flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
                  ${errors.image 
                    ? 'border-red-300 bg-red-50 hover:border-red-400' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                <svg className={`w-12 h-12 mb-2 ${errors.image ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className={`text-sm ${errors.image ? 'text-red-600' : 'text-gray-600'}`}>
                  Clique para adicionar uma imagem *
                </span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</span>
              </label>
            </div>
          )}
          {errors.image && (
            <p className="text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Publicando...' : 'Elogiar 🎉'}
          </Button>
        </div>
      </form>
    </div>
  );
}); 