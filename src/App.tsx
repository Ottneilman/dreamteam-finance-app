import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line
} from 'recharts';
import {
  Plus, Edit2, Trash2,
  TrendingUp, TrendingDown, Wallet,
  Calendar, ChevronLeft, ChevronRight,
  Settings
} from 'lucide-react';

// Colores fluorescentes definidos
const FLUORESCENT_GREEN = '#39FF14'; // Un verde neón brillante
const FLUORESCENT_RED = '#FF073A';   // Un rojo neón vibrante
const VIVID_RED = '#DC2626';         // El rojo vivo de los botones de gastos (red-600 de Tailwind)

// Estilos CSS para el encabezado con degradado profesional y llamativo
const headerStyles = `
  .static-header {
    /* Degradado lineal de negro a verde fluorescente en el centro */
    background: linear-gradient(90deg, #000000 0%, ${FLUORESCENT_GREEN} 50%, #000000 100%);
    background-size: 100% 100%; /* Tamaño normal para un degradado estático */
  }

  .author-text-glow {
    /* Textura realzada con brillos fluorescentes y una sombra oscura para mejor legibilidad */
    color: white; /* Base del texto en blanco */
    text-shadow:
      0 0 4px rgba(0, 0, 0, 0.8), /* Sombra oscura para pop */
      0 0 10px ${FLUORESCENT_GREEN}, /* Brillo verde fluorescente */
      0 0 20px ${FLUORESCENT_RED}; /* Brillo rojo fluorescente */
  }

  .subtitle-text-shadow {
    /* Sombra para dar cuerpo al texto del subtítulo */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  }
`;

// Hook para persistencia en localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// StatCard: tarjeta de resumen
interface StatCardProps {
  title: string;
  value: number;
  icon: React.FC<any>;
  color: string;
  bgColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, bgColor }) => (
  // Borde cian vibrante
  <div className={`${bgColor} p-6 rounded-xl shadow-lg border-2 border-cyan-500 transform hover:scale-105 transition-transform`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-300 text-lg font-bold">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>${value.toLocaleString()}</p>
      </div>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
  </div>
);

// CategoryManager: gestor de categorías
interface CategoryManagerProps {
  categories: string[];
  show: boolean;
  onEdit: (oldCat: string, newCat: string) => void;
  onDelete: (cat: string) => void;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories, show, onEdit, onDelete, onClose
}) => {
  const [editing, setEditing] = React.useState<string | null>(null);
  const [value, setValue] = React.useState('');

  if (!show) return null;

  return (
    // Fondo gris oscuro con borde gris
    <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="text-lg font-bold mb-3 text-fuchsia-400 flex items-center gap-2"> {/* Título rosa vibrante */}
        <Settings size={20} />Gestionar Categorías
      </h4>
      <div className="space-y-2">
        {categories.map(cat => (
          // Fondo gris más claro
          <div key={cat} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
            {editing === cat ? (
              <>
                {/* Fondo y borde ajustados */}
                <input
                  type="text"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="flex-1 bg-gray-600 text-white px-3 py-1 rounded border border-gray-500 focus:border-fuchsia-400" // Foco rosa
                />
                {/* Botón verde vibrante */}
                <button
                  onClick={() => { onEdit(cat, value); setEditing(null); }}
                  className="bg-lime-500 px-3 py-1 rounded text-sm text-white hover:bg-lime-600"
                >
                  Guardar
                </button>
                {/* Fondo ajustado */}
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-600 px-3 py-1 rounded text-sm text-white hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {/* Color de texto ajustado */}
                <span className="flex-1 text-gray-200">{cat}</span>
                <button
                  onClick={() => { setEditing(cat); setValue(cat); }}
                  className="text-cyan-400 hover:text-cyan-300" // Cian vibrante para editar
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(cat)}
                  className="text-red-500 hover:text-red-400" // Rojo intenso para eliminar
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        Cerrar
      </button>
    </div>
  );
};

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Nueva paleta de colores vibrantes para los gráficos
const COLORS = ['#FF00FF', '#00FFFF', '#00FF00', '#FF4500', '#8A2BE2', '#F59E0B', '#10B981', '#3B82F6'];

const DreamTeamFinanceApp: React.FC = () => {
  // Navegación de meses
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Persistencia
  const [monthlyData, setMonthlyData] = useLocalStorage<{
    [key: string]: {
      incomes: { id: number; name: string; amount: number; date: string }[];
      expenses: { id: number; category: string; amount: number; date: string }[];
    };
  }>('monthlyData', {});

  const [categories, setCategories] = useLocalStorage<string[]>(
    'categories',
    ['Vivienda', 'Transporte', 'Alimentación', 'Otros Gastos']
  );

  // UI: formularios y ediciones
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingIncome, setEditingIncome] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<number | null>(null);

  // Formularios: datos temporales
  const [incomeForm, setIncomeForm] = useState({ name: '', amount: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', date: '' });
  const [newCategory, setNewCategory] = useState('');

  // Datos del mes actual
  const monthKey = `${currentYear}-${currentMonth}`;
  // Inicializar currentMonthData si no existe
  React.useEffect(() => {
    if (!monthlyData[monthKey]) {
      setMonthlyData(prevData => ({
        ...prevData,
        [monthKey]: { incomes: [], expenses: [] }
      }));
    }
  }, [monthKey, monthlyData, setMonthlyData]);

  const currentMonthData = monthlyData[monthKey] || { incomes: [], expenses: [] };

  // Totales
  const totalIncome = currentMonthData.incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = currentMonthData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const available = totalIncome - totalExpenses;

  // Datos para gráfico de pastel
  const expensesByCategory = categories
    .map(category => {
      const total = currentMonthData.expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: category, value: total };
    })
    .filter(item => item.value > 0);

  // Datos para comparación mensual (líneas de ingreso/gasto/disponible)
  const monthlyComparison = Object.entries(monthlyData)
    .sort(([keyA], [keyB]) => { // Ordenar por año y mes
      const [yA, mA] = keyA.split('-').map(Number);
      const [yB, mB] = keyB.split('-').map(Number);
      if (yA !== yB) return yA - yB;
      return mA - mB;
    })
    .map(([key, data]) => {
      const [y, m] = key.split('-').map(Number);
      const ingresos = data.incomes.reduce((sum, i) => sum + i.amount, 0);
      const gastos = data.expenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        month: `${monthNames[m]} ${y}`, // Año añadido para mayor claridad
        ingresos,
        gastos,
        disponible: ingresos - gastos
      };
    });

  // Navegación de meses
  const navigateMonth = (dir: 'prev' | 'next') => {
    let m = currentMonth, y = currentYear;
    if (dir === 'prev') {
      if (m === 0) { m = 11; y--; }
      else m--;
    } else {
      if (m === 11) { m = 0; y++; }
      else m++;
    }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  // Funciones para Ingresos
  const handleAddIncome = () => {
    if (incomeForm.name && incomeForm.amount && incomeForm.date) {
      const newIncome = {
        id: Date.now(),
        name: incomeForm.name,
        amount: parseFloat(incomeForm.amount),
        date: incomeForm.date
      };
      const updated = {
        ...currentMonthData,
        incomes: [...currentMonthData.incomes, newIncome]
      };
      const newData = { ...monthlyData, [monthKey]: updated };
      setMonthlyData(newData);
      setIncomeForm({ name: '', amount: '', date: '' });
      setShowIncomeForm(false);
      setEditingIncome(null);
    } else {
      console.warn("Por favor, rellena todos los campos de ingreso.");
    }
  };

  const handleEditIncome = (inc: any) => {
    setEditingIncome(inc.id);
    setIncomeForm({ name: inc.name, amount: inc.amount.toString(), date: inc.date });
    setShowIncomeForm(true);
  };

  const handleUpdateIncome = () => {
    if (editingIncome !== null && incomeForm.name && incomeForm.amount && incomeForm.date) {
      const updatedIncomes = currentMonthData.incomes.map(inc =>
        inc.id === editingIncome
          ? { ...inc, name: incomeForm.name, amount: parseFloat(incomeForm.amount), date: incomeForm.date }
          : inc
      );
      const updated = { ...currentMonthData, incomes: updatedIncomes };
      setMonthlyData({ ...monthlyData, [monthKey]: updated });
      setIncomeForm({ name: '', amount: '', date: '' });
      setShowIncomeForm(false);
      setEditingIncome(null);
    } else {
      console.warn("Por favor, rellena todos los campos de ingreso para actualizar.");
    }
  };

  const handleDeleteIncome = (id: number) => {
    const updatedIncomes = currentMonthData.incomes.filter(inc => inc.id !== id);
    setMonthlyData({ ...monthlyData, [monthKey]: { ...currentMonthData, incomes: updatedIncomes } });
  };

  // Funciones para Gastos
  const handleAddExpense = () => {
    if (expenseForm.category && expenseForm.amount && expenseForm.date) {
      const newExpense = {
        id: Date.now(),
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        date: expenseForm.date
      };
      const updated = {
        ...currentMonthData,
        expenses: [...currentMonthData.expenses, newExpense]
      };
      setMonthlyData({ ...monthlyData, [monthKey]: updated });
      setExpenseForm({ category: '', amount: '', date: '' });
      setShowExpenseForm(false);
      setEditingExpense(null);
    } else {
      console.warn("Por favor, rellena todos los campos de gasto.");
    }
  };

  const handleEditExpense = (exp: any) => {
    setEditingExpense(exp.id);
    setExpenseForm({ category: exp.category, amount: exp.amount.toString(), date: exp.date });
    setShowExpenseForm(true);
  };

  const handleUpdateExpense = () => {
    if (editingExpense !== null && expenseForm.category && expenseForm.amount && expenseForm.date) {
      const updatedExpenses = currentMonthData.expenses.map(exp =>
        exp.id === editingExpense
          ? { ...exp, category: expenseForm.category, amount: parseFloat(expenseForm.amount), date: expenseForm.date }
          : exp
      );
      setMonthlyData({ ...monthlyData, [monthKey]: { ...currentMonthData, expenses: updatedExpenses } });
      setExpenseForm({ category: '', amount: '', date: '' });
      setShowExpenseForm(false);
      setEditingExpense(null);
    } else {
      console.warn("Por favor, rellena todos los campos de gasto para actualizar.");
    }
  };

  const handleDeleteExpense = (id: number) => {
    const updatedExpenses = currentMonthData.expenses.filter(exp => exp.id !== id);
    setMonthlyData({ ...monthlyData, [monthKey]: { ...currentMonthData, expenses: updatedExpenses } });
  };

  // Funciones para Categorías
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryForm(false);
    } else {
      console.warn("La categoría no puede estar vacía o ya existe.");
    }
  };

  const handleEditCategory = (oldCat: string, newCat: string) => {
    const trimmedNewCat = newCat.trim();
    if (trimmedNewCat && trimmedNewCat !== oldCat && !categories.includes(trimmedNewCat)) {
      const updatedCats = categories.map(c => (c === oldCat ? trimmedNewCat : c));
      setCategories(updatedCats);
      // Renombrar en monthlyData
      const newData: typeof monthlyData = {};
      Object.entries(monthlyData).forEach(([key, data]) => {
        newData[key] = {
          ...data,
          expenses: data.expenses.map((e: any) =>
            e.category === oldCat ? { ...e, category: trimmedNewCat } : e
          )
        };
      });
      setMonthlyData(newData);
    } else {
      console.warn("El nombre de la categoría no es válido o ya existe.");
    }
  };

  const handleDeleteCategory = (cat: string) => {
    const used = Object.values(monthlyData).some((data: any) =>
      data.expenses.some((e: any) => e.category === cat)
    );
    if (used) {
      console.warn('No puedes borrar, categoría con gastos asociados.');
      return;
    }
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Estilos CSS inyectados */}
      <style>{headerStyles}</style>

      {/* Header con degradado fluorescente y textura */}
      <header className="static-header p-8 shadow-lg">
        <div className="max-w-7xl mx-auto text-center">
          {/* Título blanco para contraste */}
          <h1 className="text-5xl font-black text-white tracking-wide" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>DREAMTEAM</h1>
          {/* Texto gris claro para subtítulo con sombra */}
          <p className="text-gray-200 text-xl mt-2 font-bold subtitle-text-shadow">Gestor de Finanzas Personales</p>
          {/* Texto del autor con textura fluorescente mejorada */}
          <p className="text-lg mt-2 font-semibold author-text-glow">By Otto N. Manrique</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Módulo de Navegación de Meses */}
        <div className="bg-gray-900 p-4 rounded-xl shadow-lg border-2" style={{ borderColor: FLUORESCENT_GREEN }}> {/* Borde verde eléctrico */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              // Botones con el verde fluorescente y textura
              className="flex items-center gap-2 text-black font-bold px-6 py-3 rounded-lg transition-colors shadow-lg" /* Texto negro */
              style={{ backgroundColor: FLUORESCENT_GREEN, boxShadow: `0 0 10px ${FLUORESCENT_GREEN}` }}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            <div className="flex items-center gap-3">
              {/* Icono de calendario verde eléctrico */}
              <Calendar style={{ color: FLUORESCENT_GREEN }} size={24} />
              {/* Mes/año verde eléctrico */}
              <h2
                className="text-2xl font-bold text-center"
                style={{ color: FLUORESCENT_GREEN, textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
              >
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>

            <button
              onClick={() => navigateMonth('next')}
              // Botones con el verde fluorescente y textura
              className="flex items-center gap-2 text-black font-bold px-6 py-3 rounded-lg transition-colors shadow-lg" /* Texto negro */
              style={{ backgroundColor: FLUORESCENT_GREEN, boxShadow: `0 0 10px ${FLUORESCENT_GREEN}` }}
            >
              Siguiente
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Tarjetas de Resumen con fondos oscuros y colores vibrantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Ingresos Totales"
            value={totalIncome}
            icon={TrendingUp}
            color={`text-[${FLUORESCENT_GREEN}]`} // Verde eléctrico
            bgColor="bg-gray-900" // Fondo oscuro
          />
          <StatCard
            title="Gastos Totales"
            value={totalExpenses}
            icon={TrendingDown}
            color={`text-[${VIVID_RED}]`} // Rojo sangre
            bgColor="bg-gray-900" // Fondo oscuro
          />
          <StatCard
            title="Disponible"
            value={available}
            icon={Wallet}
            color={available >= 0 ? 'text-cyan-400' : `text-[${VIVID_RED}]`} // Cian para positivo, Rojo sangre para negativo
            bgColor="bg-gray-900" // Fondo oscuro
          />
        </div>

        {/* Gráficos con fondos oscuros y bordes vibrantes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Gastos por Categoría */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border-2 border-fuchsia-500"> {/* Borde rosa vibrante */}
            <h3 className="text-xl font-bold mb-4 text-center text-fuchsia-400"> {/* Título rosa vibrante */}
              Gastos por Categoría
            </h3>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">
                <p>No hay gastos registrados para este mes</p>
              </div>
            )}
          </div>

          {/* Resumen del Mes (BarChart) */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border-2 border-lime-500"> {/* Borde verde vibrante */}
            <h3 className="text-xl font-bold mb-4 text-center text-lime-400"> {/* Título verde vibrante */}
              Resumen del Mes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Ingresos', value: totalIncome, fill: '#00FF00' }, // Verde vibrante
                  { name: 'Gastos', value: totalExpenses, fill: '#FF4500' }, // Naranja/rojo intenso
                  {
                    name: 'Disponible',
                    value: available,
                    fill: available >= 0 ? '#00FFFF' : '#FF00FF' // Cian para positivo, Magenta para negativo
                  }
                ]}
              >
                {/* Cuadrícula más oscura */}
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparación Mensual (LineChart) */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border-2 border-cyan-500 lg:col-span-2"> {/* Borde azul vibrante */}
            <h3 className="text-xl font-bold mb-4 text-center text-cyan-400"> {/* Título azul vibrante */}
              Comparación Mensual
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyComparison}>
                {/* Cuadrícula más oscura */}
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563"/>
                <XAxis dataKey="month" stroke="#9CA3AF"/>
                <YAxis stroke="#9CA3AF"/>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#00FF00" // Verde vibrante
                  strokeWidth={3}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="gastos"
                  stroke="#FF4500" // Naranja/rojo intenso
                  strokeWidth={3}
                  name="Gastos"
                />
                <Line
                  type="monotone"
                  dataKey="disponible"
                  stroke="#FF00FF" // Rosa/magenta vibrante
                  strokeWidth={3}
                  name="Disponible"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sección de Ingresos */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border-2" style={{ borderColor: FLUORESCENT_GREEN }}> {/* Borde verde fluorescente */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: FLUORESCENT_GREEN }}> {/* Título verde fluorescente */}
              Ingresos - {monthNames[currentMonth]}
            </h3>
            <button
              onClick={() => setShowIncomeForm(!showIncomeForm)}
              className="flex items-center gap-2 text-black px-4 py-2 rounded-lg transition-colors" /* Texto negro */
              style={{ backgroundColor: FLUORESCENT_GREEN, boxShadow: `0 0 10px ${FLUORESCENT_GREEN}` }}
            >
              <Plus size={20} /> Agregar Ingreso
            </button>
          </div>

          {showIncomeForm && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg"> {/* Fondo más oscuro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del ingreso"
                  value={incomeForm.name}
                  onChange={e => setIncomeForm({ ...incomeForm, name: e.target.value })}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                  style={{ borderColor: FLUORESCENT_GREEN }} /* Foco verde fluorescente */
                />
                <input
                  type="number"
                  placeholder="Monto"
                  value={incomeForm.amount}
                  onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                  style={{ borderColor: FLUORESCENT_GREEN }} /* Foco verde fluorescente */
                />
                <input
                  type="date"
                  value={incomeForm.date}
                  onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                  style={{ borderColor: FLUORESCENT_GREEN }} /* Foco verde fluorescente */
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={editingIncome ? handleUpdateIncome : handleAddIncome}
                  className="text-black px-4 py-2 rounded-lg" /* Texto negro */
                  style={{ backgroundColor: FLUORESCENT_GREEN, boxShadow: `0 0 10px ${FLUORESCENT_GREEN}` }}
                >
                  {editingIncome ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  onClick={() => {
                    setShowIncomeForm(false);
                    setEditingIncome(null);
                    setIncomeForm({ name: '', amount: '', date: '' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {currentMonthData.incomes.length > 0 ? (
              currentMonthData.incomes.map(inc => (
                <div key={inc.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"> {/* Fondo más oscuro */}
                  <div>
                    <span className="font-medium text-gray-100">{inc.name}</span>
                    <span className="ml-4" style={{ color: FLUORESCENT_GREEN }}>${inc.amount.toLocaleString()}</span> {/* Valor verde fluorescente */}
                    <span className="text-gray-400 ml-4 text-sm">{inc.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditIncome(inc)} className="text-cyan-400 hover:text-cyan-300"> {/* Cian vibrante para editar */}
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteIncome(inc.id)} className="text-red-500 hover:text-red-400"> {/* Rojo intenso para eliminar */}
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No hay ingresos registrados para este mes.</p>
            )}
          </div>
        </div>

        {/* Sección de Gastos con tema carmesí/fuego y fondo gris */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border-2 border-red-500"> {/* Fondo gris oscuro, borde rojo */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-xl font-bold" style={{ color: VIVID_RED }}> {/* Título rojo vivo */}
              Gastos - {monthNames[currentMonth]}
            </h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" // Botón rojo
              >
                <Settings size={20} /> Gestionar Categorías
              </button>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" // Botón rojo
              >
                <Plus size={20} /> Nueva Categoría
              </button>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" // Botón rojo
              >
                <Plus size={20} /> Agregar Gasto
              </button>
            </div>
          </div>

          <CategoryManager
            categories={categories}
            show={showCategoryManager}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onClose={() => setShowCategoryManager(false)}
          />

          {showCategoryForm && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg"> {/* Fondo gris más oscuro */}
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nombre de la categoría"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-400" // Foco rojo
                />
                <button onClick={handleAddCategory} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"> {/* Botón rojo */}
                  Agregar
                </button>
                <button
                  onClick={() => { setShowCategoryForm(false); setNewCategory(''); }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {showExpenseForm && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg"> {/* Fondo gris más oscuro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-400" // Foco rojo
                >
                  <option value="">Selecciona Categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Monto del gasto"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-400" // Foco rojo
                />
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-400" // Foco rojo
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={editingExpense ? handleUpdateExpense : handleAddExpense}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" // Botón rojo
                >
                  {editingExpense ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  onClick={() => {
                    setShowExpenseForm(false);
                    setEditingExpense(null);
                    setExpenseForm({ category: '', amount: '', date: '' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {currentMonthData.expenses.length > 0 ? (
              currentMonthData.expenses.map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"> {/* Fondo más oscuro */}
                  <div>
                    <span className="font-medium text-gray-100">{exp.category}</span>
                    <span className="text-red-400 ml-4">${exp.amount.toLocaleString()}</span> {/* Valor rojo */}
                    <span className="text-gray-400 ml-4 text-sm">{exp.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditExpense(exp)} className="text-cyan-400 hover:text-cyan-300"> {/* Cian vibrante para editar */}
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-300 hover:text-red-200"> {/* Rojo más claro para eliminar */}
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No hay gastos registrados para este mes.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 p-6 text-center text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} DreamTeam Finance. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default DreamTeamFinanceApp;
