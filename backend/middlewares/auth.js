const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('🔐 Auth middleware - Request path:', req.path);
  console.log('🔐 Auth middleware - Token present:', !!token);
  console.log('🔐 Auth middleware - JWT_SECRET available:', !!process.env.JWT_SECRET);
  
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }
  
  try {
    console.log('🔐 Auth middleware - Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully:', { 
      userId: decoded.id, 
      email: decoded.email, 
      role: decoded.role 
    });
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    console.error('❌ JWT_SECRET:', process.env.JWT_SECRET ? 'Available' : 'Not available');
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    console.log('🔒 Role check - Required:', role, 'User role:', req.user?.role);
    if (req.user.role !== role) {
      console.log('❌ Insufficient permissions');
      return res.status(403).json({ message: 'Không đủ quyền' });
    }
    next();
  };
}

module.exports = { auth, requireRole }; 