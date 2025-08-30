/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser, updateUser } from "@/lib/api";

const createUserSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
	role: z.enum(["admin", "manager", "user"]),
});

const updateUserSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6).optional(),
	role: z.enum(["admin", "manager", "user"]),
	status: z.enum(["active", "inactive", "pending"]),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export default function UserForm({ user, onSuccess }: { user?: any; onSuccess?: (created?: any) => void }) {
	const isEdit = Boolean(user && user.id);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateUserFormValues | UpdateUserFormValues>({
		resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema as any),
		defaultValues: user || {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			role: "user",
			status: "active",
		},
	});

	const onSubmit = async (data: any) => {
		try {
			let returnedUser = null;
			if (isEdit) {
				const payload: any = {
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					role: data.role,
					status: data.status,
				};
				if (data.password) payload.password = data.password;
				returnedUser = await updateUser(user.id, payload);
			} else {
				returnedUser = await createUser(data);
			}
			reset();
			if (onSuccess) onSuccess(returnedUser || undefined);
		} catch (err) {
			alert("Operation failed");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
			<Input
				{...register("firstName")}
				placeholder="First Name"
				className={errors.firstName ? "border-red-500" : ""}
			/>
			{errors.firstName && <span className="text-red-500">{(errors.firstName as any).message}</span>}

			<Input
				{...register("lastName")}
				placeholder="Last Name"
				className={errors.lastName ? "border-red-500" : ""}
			/>
			{errors.lastName && <span className="text-red-500">{(errors.lastName as any).message}</span>}

			<Input
				{...register("email")}
				placeholder="Email"
				className={errors.email ? "border-red-500" : ""}
			/>
			{errors.email && <span className="text-red-500">{(errors.email as any).message}</span>}

			<Input
				{...register("password")}
				type="password"
				placeholder={isEdit ? "Leave empty to keep current password" : "Password"}
				className={errors.password ? "border-red-500" : ""}
			/>
			{errors.password && <span className="text-red-500">{(errors.password as any).message}</span>}

			<div className="flex gap-2">
				<select {...register("role")} className={errors.role ? "border-red-500" : "border rounded px-2 py-1"}>
					<option value="admin">Admin</option>
					<option value="manager">Manager</option>
					<option value="user">User</option>
				</select>

				<select {...register("status")} className={errors.role ? "border-red-500" : "border rounded px-2 py-1"}>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
					<option value="pending">Pending</option>
				</select>
			</div>

			<Button type="submit" disabled={isSubmitting}>
				{isEdit ? "Update User" : "Add User"}
			</Button>
		</form>
	);
}
