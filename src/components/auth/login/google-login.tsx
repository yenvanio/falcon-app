import {GoogleIcon} from "@/components/ui/icons/google-icon";
import {Button} from "@/components/ui/button";

interface GoogleAuthButtonProps {
    isLogin: boolean
    onClick: () => void
}

export default function GoogleAuthButton({isLogin, onClick}: GoogleAuthButtonProps) {
    return (
        <Button
            variant="ghost"
            className="flex justify-center gap-5 rounded bg-white px-4 py-4 text-sm drop-shadow-sm hover:bg-gray-50"
            onClick={onClick}
        >
            <GoogleIcon/>
            <div>
                <p>{isLogin ? 'Login' : 'Sign up'} with Google</p>
            </div>
        </Button>
    )
}