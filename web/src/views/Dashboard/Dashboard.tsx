import { useContext, useEffect, useRef, useState } from "react";
import { RmaApiService } from "../../api/RMA.Service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "../../components/Button";
import { AccessToken, User, UserContext, userContextState } from "../../context/auth";
import { useNavigate } from "react-router-dom";

interface rmaStatusInterface {
  status: string;
  count: number;
}

export default function Dashboard() {
  const [rmas, setRmas] = useState<rmaStatusInterface[]>([]);
  const [startDate, setStartDate] = useState(new Date("2024/01/31"));
  const [endDate, setEndDate] = useState(new Date());
  const [averageTimeByStatus, setAverageTimeByStatus] = useState([
    { status: "Em teste", count: 0, avgTime: 0 },
    { status: "Recebido", count: 0, avgTime: 0 },
    { status: "Iniciado", count: 0, avgTime: 0 },
  ]);

 
  const { user, token, setToken, setUser} = useContext(UserContext)
  const navigate = useNavigate();

  const dashboardRef = useRef<HTMLInputElement>(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getFormattedDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}/${month > 9 ? month : `0${month}`}/${
      day >= 10 ? day : `0${day}`
    }`;
  };

  const logOut = () => {
    localStorage.setItem("me", "");
    localStorage.setItem("token", "");

    setToken(userContextState.token);
    setUser(userContextState.user);
    // navigate("/");
    // window.location.reload()
  };
  const getAllRmaByPeriod = async () => {
     console.log('token', token)
    const res = await RmaApiService.getAllRmaFromPeriod(
      {
        start_date: getFormattedDate(startDate),
        end_date: getFormattedDate(endDate),
      },
      token.access_token
    ).catch(() => logOut());

    if (res && res.data) {
      const resArr = res.data as Array<any>;
      const allPending = resArr.filter((rma: any) => rma.status === "Pending");
      const allReceived = resArr.filter(
        (rma: any) => rma.status === "Received"
      );
      const allTesting = resArr.filter((rma: any) => rma.status === "Testing");
      const allConcluded = resArr.filter(
        (rma: any) => rma.status === "Concluded"
      );

      setRmas([
        {
          status: "Iniciado",
          count: allPending.length,
        },
        {
          status: "Recebido",
          count: allReceived.length,
        },
        {
          status: "Em Teste",
          count: allTesting.length,
        },
        {
          status: "Concluído",
          count: allConcluded.length,
        },
      ]);

      // media de tempo em teste
      const allTestingTime = allConcluded.map((rma) => {
        const thisTestingStatus = allTesting.find(
          (testingRma) => testingRma.rma_id === rma.rma_id
        );

        if (thisTestingStatus) {
          const endDate = rma.date;
          const startDate = thisTestingStatus.date;
          const differenceInDays =
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (24 * 60 * 60 * 1000);
          return differenceInDays;
        }
      });

      let averageTestingTime = 0;
      allTestingTime.forEach((num) => {
        averageTestingTime += num ?? 0;
      });

      averageTestingTime = Math.ceil(
        averageTestingTime / allTestingTime.length
      );

      // media de tempo em recebido
      const allReceivedTime = allTesting.map((rma) => {
        const thisReceivedStatus = allTesting.find(
          (testingRma) => testingRma.rma_id === rma.rma_id
        );

        if (thisReceivedStatus) {
          const endDate = rma.date;
          const startDate = thisReceivedStatus.date;
          const differenceInDays =
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (24 * 60 * 60 * 1000);
          return differenceInDays;
        }
      });

      let averageReceivedTime = 0;
      allReceivedTime.forEach((num) => {
        averageReceivedTime += num ?? 0;
      });
      averageReceivedTime = Math.ceil(averageReceivedTime);

      // media de tempo em Iniciado
      const allPendingTime = allReceived.map((rma) => {
        const thisPendingStatus = allReceived.find(
          (testingRma) => testingRma.rma_id === rma.rma_id
        );
        if (thisPendingStatus) {
          const endDate = rma.date;
          const startDate = thisPendingStatus.date;
          const differenceInDays =
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (24 * 60 * 60 * 1000);
          return differenceInDays;
        }
      });

      let averagePendingTime = 0;
      allPendingTime.forEach((num) => {
        averagePendingTime += num ?? 0;
      });
      averagePendingTime = Math.ceil(averagePendingTime);

      const newTimeStats = [
        {
          status: "Iniciado",
          count: allPending.length,
          avgTime: averagePendingTime,
        },
        {
          status: "Em teste",
          count: allTesting.length,
          avgTime: averageTestingTime,
        },
        {
          status: "Recebido",
          count: allReceived.length,
          avgTime: averageReceivedTime,
        },
      ];
      setAverageTimeByStatus(newTimeStats);
    }
  };

  // Função para exportar o conteúdo do dashboard para PDF
  const exportToPDF = async () => {
    const element = dashboardRef.current as unknown as HTMLElement;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Ajusta a imagem ao tamanho da página do PDF
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("dashboard.pdf");
  };

  useEffect(() => {
    getAllRmaByPeriod();
  }, []);

  return (
    <div className="bg-white w-[50rem] mx-auto text-black border-4 border-black h-fit flex flex-col">
      <div className="flex justify-center m-4">
        <Button text="Exportar para PDF" onClickBtn={exportToPDF} />
      </div>
      <div ref={dashboardRef}>
        <h3 className="text-[1rem] font-extrabold">
          Todos os registros de RMA no ano de {new Date().getFullYear()}
        </h3>
        <h3>
          Dados apresentados de 01/01/2024 até {new Date().toLocaleDateString()}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={rmas}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <div className="border-[1px] mt-2"></div>
        <h1 className="text-[1rem] font-extrabold">
          Distribuição de todos os registros de serviços de RMA no periodo
        </h1>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={rmas}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={(entry) => `${entry.status} (${entry.count})`}
            >
              {rmas.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="border-[1px]"></div>
        <h1 className="text-[1rem] font-extrabold">
          {" "}
          Tempo médio em dias por etapa
        </h1>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={averageTimeByStatus}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis
              label={{
                value: "Tempo Médio (dias)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value) => `${value} dias`} />
            <Bar dataKey="avgTime" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
