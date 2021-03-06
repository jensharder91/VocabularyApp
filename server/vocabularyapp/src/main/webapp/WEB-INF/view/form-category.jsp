<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<!DOCTYPE html>
<html>
<head>
<title><c:choose>
		<c:when test="${category.id=='0'}">
			Create new Category
		</c:when>
		<c:otherwise>
			Update Category
		</c:otherwise>
	</c:choose></title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/add-customer-style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<c:choose>
				<c:when test="${category.id=='0'}">
					<h2>
						<a class="mybutton" href="${pageContext.request.contextPath}/category/getAll">&#171;
							Back to List</a> Create new Category
					</h2>
				</c:when>
				<c:otherwise>
					<h2>
						<a class="mybutton" href="${pageContext.request.contextPath}/category/getAll">&#171;
							Back to List</a>Update Category
					</h2>
				</c:otherwise>
			</c:choose>
		</div>
	</div>

	<div id="container">
		<form:form action="save" modelAttribute="category" method="POST">

			<!-- important, to map this customer to the right customer (while updating) -->
			<form:hidden path="id" />

			<table>
				<tbody>
					<tr>
						<td><label>Title:</label></td>
						<td><form:input path="title" /></td>
					</tr>
					<tr>
						<td><label></label></td>
						<td><input type="submit" value="Save" class="mybutton" /></td>
					</tr>
				</tbody>
			</table>
		</form:form>
	</div>

</body>
</html>