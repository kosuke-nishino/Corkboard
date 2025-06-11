import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="ログイン" />

            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md p-6">

                    {/* ロゴ風タイトル */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 tracking-tight">
                        📋📌 ConcreteBoard
                    </h1>

                    {status && (
                        <div className="mb-4 rounded bg-green-100 p-2 text-green-800 text-center text-sm border border-green-300">
                            {status}
                        </div>
                    )}

                    {(errors.email || errors.password) && (
                        <div className="mb-4 rounded bg-red-100 p-2 text-red-800 text-center text-sm border border-red-300">
                            入力内容をご確認ください。
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="メールアドレス" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="パスワード" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-2 rounded-md text-white font-semibold transition ${
                                    processing
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                ログイン
                            </button>

                            <div className="flex justify-between text-sm text-gray-600">
                                <Link href={route('register')} className="hover:text-indigo-500 underline">
                                    新規登録
                                </Link>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="hover:text-indigo-500 underline">
                                        パスワードを忘れた
                                    </Link>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
