
"use client";

import { Fragment, useEffect } from "react";
import {
	X,
	AlertCircle,
	CheckCircle,
	Info,
	AlertTriangle,
	Loader2,
} from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
	variant = "default",
	showCloseButton = true,
	closeOnOverlayClick = true,
	closeOnEsc = true,
	hideOverlay = false,
	customFooter,
	onSubmit,
	submitText = "Submit",
	cancelText = "Cancel",
	loading = false,
	overlayClassName = "",
	modalClassName = "",
	bodyClassName = "",
	footerClassName = "",
	icon,
	showIcon = false,
	maxHeight = "90vh",
	zIndex = 50,
}) => {
	// Handle ESC key press
	useEffect(() => {
		if (!closeOnEsc || !isOpen) return;

		const handleEsc = (e) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [closeOnEsc, isOpen, onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	// Size classes
	const sizeClasses = {
		xs: "max-w-xs",
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
		"3xl": "max-w-3xl",
		"4xl": "max-w-4xl",
		"5xl": "max-w-5xl",
		full: "max-w-[95vw]",
	};

	// Variant styles
	const variantStyles = {
		default: {
			header: "border-b border-neutral-200",
			icon: "text-primary-600",
			iconBg: "bg-primary-100",
		},
		success: {
			header: "border-b border-success-200",
			icon: "text-success-600",
			iconBg: "bg-success-100",
		},
		warning: {
			header: "border-b border-warning-200",
			icon: "text-warning-600",
			iconBg: "bg-warning-100",
		},
		error: {
			header: "border-b border-error-200",
			icon: "text-error-600",
			iconBg: "bg-error-100",
		},
		info: {
			header: "border-b border-blue-200",
			icon: "text-blue-600",
			iconBg: "bg-blue-100",
		},
		premium: {
			header: "border-b border-accent-200",
			icon: "text-accent-600",
			iconBg: "bg-accent-100",
		},
	};

	// Default icons for variants
	const variantIcons = {
		success: <CheckCircle className="h-6 w-6" />,
		warning: <AlertTriangle className="h-6 w-6" />,
		error: <AlertCircle className="h-6 w-6" />,
		info: <Info className="h-6 w-6" />,
		premium: <CheckCircle className="h-6 w-6" />,
		default: icon || null,
	};

	const currentVariant = variantStyles[variant] || variantStyles.default;
	const currentIcon = variantIcons[variant] || icon;

	const handleOverlayClick = (e) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	const modalContent = (
		<Fragment>
			{/* Overlay */}
			<div
				className={`fixed inset-0 transition-all duration-300 ${
					isOpen
						? "bg-black/50 backdrop-blur-sm opacity-100"
						: "opacity-0 pointer-events-none"
				} ${overlayClassName}`}
				onClick={handleOverlayClick}
				style={{ zIndex: zIndex }}
			/>

			{/* Modal */}
			<div
				className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				style={{ zIndex: zIndex + 10 }}>
				<div
					className={`bg-white rounded-2xl shadow-2xl w-full transform transition-all duration-300 ${
						isOpen ? "scale-100" : "scale-95"
					} ${sizeClasses[size]} ${modalClassName}`}>
					{/* Header */}
					<div
						className={`flex items-center justify-between p-6 ${currentVariant.header}`}>
						<div className="flex items-center gap-3">
							{showIcon && currentIcon && (
								<div
									className={`p-2 rounded-lg ${currentVariant.iconBg}`}>
									<div className={currentVariant.icon}>
										{currentIcon}
									</div>
								</div>
							)}
							<div>
								<h2 className="text-xl font-bold text-neutral-900">
									{title}
								</h2>
							</div>
						</div>

						{showCloseButton && (
							<button
								onClick={onClose}
								disabled={loading}
								className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
								aria-label="Close modal">
								<X className="h-5 w-5" />
							</button>
						)}
					</div>

					{/* Body */}
					<div
						className={`p-6 overflow-y-auto ${bodyClassName}`}
						style={{ maxHeight }}>
						{children}
					</div>

					{/* Footer */}
					{customFooter || onSubmit ? (
						<div
							className={`flex items-center justify-end gap-3 p-6 border-t border-neutral-200 ${footerClassName}`}>
							{customFooter ? (
								customFooter
							) : (
								<>
									<button
										type="button"
										onClick={onClose}
										disabled={loading}
										className="px-4 py-2.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors font-medium disabled:opacity-50">
										{cancelText}
									</button>
									<button
										type="button"
										onClick={onSubmit}
										disabled={loading}
										className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50">
										{loading && (
											<Loader2 className="h-4 w-4 animate-spin" />
										)}
										{submitText}
									</button>
								</>
							)}
						</div>
					) : null}
				</div>
			</div>
		</Fragment>
	);

	return createPortal(modalContent, document.body);
};

export default Modal;
