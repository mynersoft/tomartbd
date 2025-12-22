// components/ui/AlertModal.jsx
"use client";

import Modal from "./Modal";

const AlertModal = ({
	isOpen,
	onClose,
	title = "Alert",
	message,
	buttonText = "OK",
	variant = "info",
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			variant={variant}
			showCloseButton={false}
			closeOnOverlayClick={false}
			closeOnEsc={true}
			customFooter={
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium w-full">
					{buttonText}
				</button>
			}>
			<div className="text-center">
				<p className="text-neutral-600">{message}</p>
			</div>
		</Modal>
	);
};

export default AlertModal;
