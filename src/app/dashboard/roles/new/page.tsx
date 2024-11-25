"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(z.bigint()),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function CreateNewRoles() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const redirect = useRouter();

  const { mutateAsync, isPending } = api.roles.create.useMutation({
    onSuccess: () => {
      redirect.push("/dashboard/roles");
    },
  });

  const permissionsList = api.permission.fetchAll.useQuery();

  const onSubmit = (values: TFormSchema) => {
    toast.promise(
      mutateAsync({
        description: values.description,
        name: values.name.toUpperCase(),
        permissions: values.permissions,
      }),
      {
        loading: "Creating new role...",
        success: "New role " + form.getValues("name") + " created successfully",
      },
    );
  };

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Create new role</h2>

      <Link href={"/dashboard/roles"}>
        <Button className="w-max gap-2" variant={"outline"} size={"sm"}>
          <ChevronLeftIcon size={16} />
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

            {permissionsList.data?.length == 0 && (
              <p>No permissions defined yet.</p>
            )}

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

          <Button type="submit" loading={isPending}>
            Create
          </Button>
        </form>
      </Form>
    </section>
  );
}
