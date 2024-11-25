"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { ACTIONS, SOURCES } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePermission } from "@/hooks/user-permission";
import AccessDenied from "@/components/access-denined";

const formSchema = z.object({
  source: z.enum([
    SOURCES.USER,
    SOURCES.LOGS,
    SOURCES.PERMISSIONS,
    SOURCES.POSTS,
    SOURCES.ROLES,
  ]),
  actions: z.array(
    z.enum([ACTIONS.DELETE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.WRITE]),
  ),
  name: z.string(),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function UpdatePermission() {
  const redirect = useRouter();
  const { id } = useParams();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actions: [],
    },
  });

  const permissionData = api.permission.fetchById.useMutation({
    onSuccess: (data) => {
      form.setValue("name", data?.name + "");
      form.setValue("actions", data?.actions || []);
      form.setValue("source", data?.source as any);
    },
  });

  const context = api.useUtils();

  const { mutateAsync, isPending } =
    api.permission.updatePermissions.useMutation({
      onSuccess: () => {
        redirect.push("/dashboard/permission");

        context.permission.fetchAll.invalidate();
      },
    });

  const onSubmit = (values: TFormSchema) => {
    toast.promise(mutateAsync({ ...values, id: BigInt(id as string) }), {
      loading: "Updating permission...",
      success: "Permission updated on table " + form.getValues("source"),
    });
  };

  useEffect(() => {
    permissionData.mutate({ id: BigInt(id as string) });
  }, [id]);

  const { hasPermission, isLoading: isValidatingPermission } = usePermission(
    "PERMISSIONS",
    "WRITE",
  );

  if (permissionData.isPending) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Update permission</h2>

      <Link href={"/dashboard/permission"}>
        <Button className="w-max gap-2" variant={"outline"} size={"sm"}>
          <ChevronLeft size={16} />
          Back
        </Button>
      </Link>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a table</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SOURCES.LOGS}>LOGS</SelectItem>
                    <SelectItem value={SOURCES.PERMISSIONS}>
                      PERMISSIONS
                    </SelectItem>
                    <SelectItem value={SOURCES.ROLES}>ROLES</SelectItem>
                    <SelectItem value={SOURCES.USER}>USER</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <FormLabel>Allowed operations</FormLabel>
            {Object.values(ACTIONS).map((action) => (
              <div key={action} className="flex items-center space-x-2">
                <FormField
                  name="actions"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          id={action}
                          checked={field.value.includes(action)}
                          onCheckedChange={(checked) => {
                            const updatedActions = checked
                              ? [...field.value, action]
                              : field.value.filter((a) => a !== action);
                            field.onChange(updatedActions);
                          }}
                        />
                      </FormControl>
                      <FormLabel>{action}</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <Button type="submit" loading={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </section>
  );
}
