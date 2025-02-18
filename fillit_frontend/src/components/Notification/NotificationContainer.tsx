import useIntersect from '@/hooks/useIntersect';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import useGetNotification from '@/hooks/query/useGetNotification';
import { Notification } from '@/types/notification';
import NotificationItem from '@/components/Notification/NotificationItem';

const NotificationContainer = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useGetNotification(10);

  const pageEnd = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);

    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <>
      <div className="flex flex-col items-center pb-14 w-full overflow-x-hidden">
        {data?.pages?.[0]?.responses?.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <p className="text-2xl text-gray-600 pt-4">
              No notifications yet...
            </p>
          </div>
        ) : (
          data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.responses.map((notification: Notification) => {
                return (
                  <NotificationItem
                    key={notification.notificationId}
                    notification={notification}
                  />
                );
              })}
            </div>
          ))
        )}

        {hasNextPage && <div ref={pageEnd} style={{ height: 1 }} />}
        {isFetching && (
          <div className="h-8 pt-14">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationContainer;
