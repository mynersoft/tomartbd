// components/ui/ConfirmationModal.jsx
"use client";

import Modal from "./Modal";

const ConfirmationModal = ({
	isOpen,
	onClose,
	title = "Confirm Action",
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	variant = "warning",
	loading = false,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			variant={variant}
			showCloseButton={!loading}
			closeOnOverlayClick={!loading}
			closeOnEsc={!loading}
			onSubmit={onConfirm}
			submitText={confirmText}
			cancelText={cancelText}
			loading={loading}>
			<div className="text-center">
				<p className="text-neutral-600 mb-2">{message}</p>
				<p className="text-sm text-neutral-500">
					This action cannot be undone.
				</p>
			</div>
		</Modal>
	);
};

export default ConfirmationModal;
