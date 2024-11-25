"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(z.bigint()),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function EditRoles() {
  const { id } = useParams();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const context = api.useUtils();

  const { mutate, data, isPending } = api.roles.fetchById.useMutation({
    onSuccess: (data) => {
      if (data?.RolesPermissionJoin) {
        form.setValue(
          "permissions",
          data.RolesPermissionJoin.map((i) => i.permissionId) as any,
        );
      }

      form.setValue("name", data?.name + "");
      form.setValue("description", data?.description + "");
    },
  });

  const permissionsList = api.permission.fetchAll.useQuery();

  const editRole = api.roles.editById.useMutation({
    onSuccess: () => {
      context.roles.fetchAll.invalidate();
    },
  });

  const onSubmit = (values: TFormSchema) => {
    toast.promise(
      editRole.mutateAsync({
        id: id as string,
        ...values,
      }),
      {
        loading: "Saving your changes, please wait...",
        success: "Role updated successfully.",
      },
    );
  };

  useEffect(() => {
    mutate({ id: id as string });
  }, [id]);

  if (isPending) {
    return (
      <div className="p-4">
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">
        Editing <span className="italic">{data?.name}</span> role
      </h2>

      <Link href={"/dashboard/roles"}>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Describe the role here</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <FormLabel>Permissions</FormLabel>
            {permissionsList.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              permissionsList &&
              permissionsList.data?.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <FormField
                    name="permissions"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            id={permission.id.toString()}
                            checked={field.value.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              const updatedActions = checked
                                ? [...field.value, permission.id]
                                : field.value.filter(
                                    (a) => a !== permission.id,
                                  );
                              field.onChange(updatedActions);
                            }}
                          />
                        </FormControl>
                        <FormLabel>{permission.name}</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              ))
            )}
          </div>

          <Button type="submit" loading={editRole.isPending}>
            Save
          </Button>
        </form>
      </Form>
    </section>
  );
}
