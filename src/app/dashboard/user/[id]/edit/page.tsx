"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  roleId: z.string(),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function UpdateUserDetails() {
  const { id } = useParams();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const context = api.useUtils();

  const roles = api.roles.fetchAll.useQuery();

  const assignRoleQuery = api.user.assignRoleToUser.useMutation({
    onSuccess: () => {
      context.user.invalidate();
    },
  });

  const onSubmit = (values: TFormSchema) => {
    toast.promise(
      assignRoleQuery.mutateAsync({
        roleId: values.roleId,
        userId: id as string,
      }),
      {
        loading: `Assigning role to user...`,
        success: `Assigned role to user`,
        error: "Something went wrong!",
      },
    );
  };

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Manage role for user </h2>

      <Link href={"/dashboard"}>
        <Button className="w-max gap-2" variant={"outline"} size={"sm"}>
          <ChevronLeft size={16} />
          Back
        </Button>
      </Link>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {roles.isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.data?.map((role) => {
                        return (
                          <SelectItem
                            value={role.id.toString()}
                            key={`${role.id}-user-role-assign`}
                          >
                            {role.name}
                          </SelectItem>
                        );
                      })}
                      {roles.data?.length == 0 && (
                        <SelectItem value="none" disabled>
                          No roles found to assign
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit">Assign role</Button>
        </form>
      </Form>
    </section>
  );
}
