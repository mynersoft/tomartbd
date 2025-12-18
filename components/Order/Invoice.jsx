"use client";

import React from "react";
import {
	PDFDownloadLink,
	Document,
	Page,
	Text,
	View,
	StyleSheet,
} from "@react-pdf/renderer";

// Styles for PDF
const styles = StyleSheet.create({
	page: { padding: 30, fontSize: 12 },
	section: { marginBottom: 10 },
	header: { fontSize: 18, marginBottom: 10, textAlign: "center" },
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		paddingVertical: 5,
	},
	tableCol: { flex: 1 },
	tableHeader: { fontWeight: "bold" },
});

// Invoice PDF document
const InvoicePDF = ({ order }) => (

	<Document>


		<Page style={styles.page}>
			<Text style={styles.header}>Invoice</Text>

			<View style={styles.section}>
				<Text>Order ID: {order.id}</Text>
				<Text>Customer: {order.customer.name}</Text>
				<Text>Email: {order.customer.email}</Text>
				<Text>
					Date: {new Date(order.createdAt).toLocaleDateString()}
				</Text>
				<Text>Status: {order.status}</Text>
			</View>

			<View style={[styles.section, { marginTop: 10 }]}>
				<Text style={styles.tableHeader}>Items</Text>
				{order.items && order.items.length > 0 ? (
					order.items.map((item, idx) => (
						<View key={idx} style={styles.tableRow}>
							<Text style={styles.tableCol}>{item}</Text>
							<Text style={styles.tableCol}>
								Qty: {order.itemsQty?.[idx] || 1}
							</Text>
							<Text style={styles.tableCol}>
								Price: $
								{order.itemsPrice?.[idx]?.toFixed(2) || "0.00"}
							</Text>
						</View>
					))
				) : (
					<Text>No items</Text>
				)}
			</View>

			<View style={styles.section}>
				<Text style={{ fontWeight: "bold", marginTop: 10 }}>
					Total: ${order.total.toFixed(2)}
				</Text>
			</View>

			<Text
				style={{
					marginTop: 20,
					fontSize: 10,
					textAlign: "center",
					color: "#999",
				}}>
				Thank you for your order!
			</Text>
		</Page>
	</Document>
);


export default function InvoiceButton({ order }) {
	return (
		<PDFDownloadLink
			document={<InvoicePDF order={order} />}
			fileName={`invoice-${order._id}.pdf`}
			className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
			{({ loading }) => (loading ? "Generating..." : "Download Invoice")}
		</PDFDownloadLink>
	);
}
