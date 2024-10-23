import {GoogleIcon} from "@/components/ui/icons/google-icon";
import {Button} from "@/components/ui/button";
import {AppleIcon} from "@/components/ui/icons/apple-icon";

interface AppleAuthButtonProps {
    isLogin: boolean
    onClick: () => void
}

export default function AppleAuthButton({isLogin, onClick}: AppleAuthButtonProps) {
    return (
        <Button
            variant="ghost"
            className="flex justify-center gap-5 rounded bg-white px-4 py-4 text-sm drop-shadow-sm hover:bg-gray-50"
            onClick={onClick}
        >
            <AppleIcon/>
            <div>
                <p>{isLogin ? 'Login' : 'Sign up'} with Apple</p>
            </div>
        </Button>
    )
}