import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({

   email: z.string().email("Invalid email address"),
   password: z.string().min(6),
});


const SignInPage = () => {
   const { login, isLoggingIn } = useAuth();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         password: "",
      }
   });

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      if (isLoggingIn) return;
      console.log(data);
      login(data)
   }
   return (
      <div className="flex  min-h-svh items-center justify-center ">
         <Card className="w-full max-w-md mx-4">
            <CardHeader>
               <CardTitle className="uppercase">Sign In</CardTitle>
               <CardDescription>
                  Enter your information below to sign in to your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-7">


                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem >
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input disabled={isLoggingIn} placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem >
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <Input disabled={isLoggingIn} type="password" placeholder="********" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button type="submit" disabled={isLoggingIn} className="w-full">
                        {isLoggingIn && <Spinner />} Sign In
                     </Button>

                  </form>
               </Form>
               <div className=" mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="underline">
                     Sign up
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}

export default SignInPage;