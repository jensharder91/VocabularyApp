<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<!DOCTYPE html>
<html>
<head>
<title>Save Customers</title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/add-customer-style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<h2>My Header</h2>
		</div>
	</div>

	<div id="container">
		<h2>Save Category</h2>
		<form:form action="save" modelAttribute="category"
			method="POST">
			
			<!-- important, to map this customer to the right customer (while updating) -->
			<form:hidden path="id"/>

			<table>
				<tbody>
					<tr>
						<td><label>Title:</label></td>
						<td><form:input path="title" /></td>
					</tr>
					<tr>
						<td><label></label></td>
						<td><input type="submit" value="Save" class="save" /></td>
					</tr>
				</tbody>
			</table>
		</form:form>

		<div style="">
			<a href="${pageContext.request.contextPath}/category/getAll">Back to
				List</a>
		</div>
	</div>

</body>
</html>