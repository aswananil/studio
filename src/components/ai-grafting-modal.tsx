'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { automatedGraftingAssistance } from '@/ai/flows/ai-powered-grafting-assistance';
import type { AutomatedGraftingAssistanceOutput } from '@/ai/flows/ai-powered-grafting-assistance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';

const formSchema = z.object({
  stemDiameterInMillimeters: z.coerce.number().min(1, 'Must be at least 1mm').max(50, 'Must be 50mm or less'),
  desiredGraftAngleInDegrees: z.coerce.number().min(10, 'Must be at least 10°').max(80, 'Must be 80° or less'),
});

type AiGraftingModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function AiGraftingModal({ isOpen, onOpenChange }: AiGraftingModalProps) {
  const { toast } = useToast();
  const [result, setResult] = useState<AutomatedGraftingAssistanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stemDiameterInMillimeters: 10,
      desiredGraftAngleInDegrees: 45,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setResult(null);
    setError(null);
    try {
      const cameraFeedDataUri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const output = await automatedGraftingAssistance({
        ...values,
        cameraFeedDataUri,
      });
      setResult(output);
      toast({
        title: 'Analysis Complete',
        description: 'Optimal grafting parameters found.',
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'AI Analysis Failed',
        description: errorMessage,
      });
    }
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a short delay to allow animation to finish
    setTimeout(() => {
        form.reset();
        setResult(null);
        setError(null);
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">AI Grafting Assistance</DialogTitle>
          <DialogDescription>
            Enter plant parameters to calculate the optimal graft.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stemDiameterInMillimeters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stem Diameter (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desiredGraftAngleInDegrees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Graft Angle (°)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Analyze
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {result && (
          <Card className="mt-4 bg-black/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <h3 className="font-bold">Optimal Graft Found</h3>
              </div>
              <p><strong>Coordinates (X, Y, Z):</strong> {result.optimalGraftingCoordinates.x}, {result.optimalGraftingCoordinates.y}, {result.optimalGraftingCoordinates.z}</p>
              <p><strong>Moment:</strong> {result.optimalGraftingMomentDescription}</p>
            </CardContent>
          </Card>
        )}
        {error && (
           <Card className="mt-4 bg-destructive/20 border-destructive">
            <CardContent className="p-4 space-y-2 text-destructive-foreground">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold">Error</h3>
              </div>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
