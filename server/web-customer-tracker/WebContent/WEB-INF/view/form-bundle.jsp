<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
		<form:form action="save" modelAttribute="bundle" method="POST">

			<!-- important, to map this customer to the right customer (while updating) -->
			<form:hidden path="id" />
			<%-- <form:hidden path="categoryId" /> --%>
			<input name="groupId" type="hidden" value="${groupId}"/>

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

		<!--  backToBundleLink with category id -->
		<c:url var="backToGroupsLink" value="/bundle/show">
			<c:param name="categoryId" value="${categoryId}"></c:param>
			<c:param name="groupId" value="${groupId}"></c:param>
		</c:url>

		<div style="">
			<a href="${backToGroupsLink}">Back to List</a>
		</div>
	</div>

</body>
</html>